import { Component, OnInit } from '@angular/core';
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

  constructor(
    public alertController: AlertController,
    private router: Router,
    private auth: AuthService,
    public nav: NavService,
    public api: ApiService,
  ) {
    super(null, alertController);
  }

  ngOnInit() {
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
      }

      this.showLoading = false;

      console.log(clients);

    } catch (err) {
      console.log(err);

      this.showLoading = false;
    }
  }

  getData() {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    if (isBuyer) {
      return this.auth.user.buyers;
    } else {
      return this.auth.user.sellers;
    }
  }

  onButRemove() {
    this.presentRemoveConfirm();
  }

  async presentRemoveConfirm() {
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
    if (item.type === Client.CLIENT_TYPE_BUYER) {
      this.nav.push('profile-buyer', {
        data: item
      });
    }

  }
}
