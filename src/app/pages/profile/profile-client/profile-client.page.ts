import {Component, NgZone, OnInit} from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {NavService} from '../../../services/nav.service';
import {Client} from '../../../models/client';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.page.html',
  styleUrls: ['./profile-client.page.scss'],
})
export class ProfileClientPage extends BaseSegmentPage implements OnInit {

  static PAGE_COUNT = 20;

  showLoading = false;

  sellers = [];

  constructor(
    public alertController: AlertController,
    private router: Router,
    private auth: AuthService,
    public nav: NavService,
    public api: ApiService,
    private zone: NgZone
  ) {
    super(null, alertController);
  }

  ngOnInit() {
    this.fetchData();
  }

  ionViewDidEnter() {
    // refresh data
    this.fetchData();
  }


  onPageChanged(page: number) {
    console.log('onPageChanged');

    super.onPageChanged(page);

    this.fetchData();
  }

  async fetchData() {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    if (isBuyer) {
      if (this.auth.user.buyers) {
        // already initialized
        return;
      }
    } else {
      if (this.auth.user.sellers) {
        // already initialized
        await this.filterData();

        return;
      }
    }

    this.showLoading = true;

    try {
      const clients = await this.api.fetchClients(isBuyer);

      if (isBuyer) {
        this.auth.user.buyers = clients;
      } else {
        this.auth.user.sellers = clients;

        await this.filterData();
      }

      console.log(clients);

    } catch (err) {
      console.log(err);
    }

    this.showLoading = false;
  }

  onButRemove(index) {
    this.presentRemoveConfirm(index);
  }

  async presentRemoveConfirm(index) {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this profile?',
      message: 'This will be removed permanently from your profile list',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');

            setTimeout(() => {
              this.zone.run(() => {
                this.removeItem(index);
              });
            }, 500);

          }
        }
      ]
    });

    await alert.present();
  }

  onButAddProfile() {
    // this.router.navigate(['expiry1']);
    this.nav.push('profile-add');
  }

  onClickItem(item) {
    if (this.currentPage === this.PAGE_BUYER) {
      this.nav.push('profile-buyer', {
        data: item
      });

    } else {
      this.nav.push('profile-seller', {
        data: item
      });
    }
  }

  private removeItem(index) {
    if (this.currentPage === this.PAGE_BUYER) {
      // for buyer
      this.api.deleteClient(this.auth.user.buyers[index]);

      this.auth.user.buyers.splice(index, 1);

    } else {
      // for seller

      // remove property from property list
      let i = 0;
      for (i = 0; i < this.auth.user.propAll.length; i++) {
        let p = this.auth.user.propAll[i];
        if (p.equalTo(this.auth.user.sellers[index].property)) {
          this.auth.user.propAll.splice(i, 1);
          break;
        }
      }

      this.api.deleteClient(this.auth.user.sellers[index]);

      this.auth.user.sellers.splice(index, 1);
      this.sellers.splice(index, 1);
    }
  }

  private async filterData() {
    try {
      const clientsTemp = [];
      const proms = [];

      for (let i = 0; i < this.auth.user.sellers.length; i++) {
        if (i < this.sellers.length) {
          continue;
        }

        const c = this.auth.user.sellers[i];
        if (!c.property) {
          // fetch property
          const prom = this.api.fetchPropertyWithId(c.propertyId)
            .then((p) => {
              c.property = p;
            });
          proms.push(prom);
        }

        clientsTemp.push(c);

        if (clientsTemp.length >= ProfileClientPage.PAGE_COUNT) {
          break;
        }
      }

      await Promise.all(proms);
      console.log(clientsTemp);

      this.sellers = this.sellers.concat(clientsTemp);
    } finally {
      // hide loading mask
      this.showLoading = false;
    }
  }

  async loadMoreData(event) {
    await this.filterData();

    event.target.complete();

    // check if all loaded
    if (this.sellers.length >= this.auth.user.sellers.length) {
      event.target.disabled = true;
    }
  }
}
