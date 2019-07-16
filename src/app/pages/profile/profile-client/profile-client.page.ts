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

  showLoading = false;

  buyers = [];
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
    // this.setData();
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
        this.buyers = this.auth.user.buyers;
        return;
      }
    } else {
      if (this.auth.user.sellers) {
        // already initialized
        this.sellers = this.auth.user.sellers;
        return;
      }
    }

    this.showLoading = true;

    try {
      const clients = await this.api.fetchClients(isBuyer);

      if (isBuyer) {
        this.auth.user.buyers = clients;
        this.buyers = this.auth.user.buyers;
      } else {
        this.auth.user.sellers = clients;
        this.sellers = this.auth.user.sellers;
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
    this.router.navigate(['expiry1']);
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
      this.api.deleteClient(this.auth.user.sellers[index]);

      this.auth.user.sellers.splice(index, 1);
    }

    this.setData();
  }

  private setData() {
    if (this.currentPage === this.PAGE_BUYER) {
      this.buyers = [...this.auth.user.buyers];
    } else {
      this.sellers = [...this.auth.user.sellers];
    }
  }
}
