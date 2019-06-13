import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Property} from '../../../models/property';
import {Client} from '../../../models/client';
import {ApiService} from '../../../services/api/api.service';
import {FirebaseManager} from '../../../helpers/firebase-manager';
import {Favourite} from '../../../models/favourite';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-buyers',
  templateUrl: './buyers.page.html',
  styleUrls: ['./buyers.page.scss'],
})
export class BuyersPage implements OnInit {

  showLoading = true;

  sellerId = '';
  seller: Client;
  buyers: Array<Client> = [];

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    public api: ApiService,
  ) {
    this.sellerId = this.route.snapshot.params['sellerId'];
  }

  async ngOnInit() {
    // fetch seller
    this.seller = await this.api.fetchClientWithId(this.sellerId, false);

    this.fetchData();
  }

  async fetchData() {
    try {
      // fetch all properties
      this.buyers = await this.api.getFavouriteBuyersOfSeller(this.sellerId);

      console.log(this.buyers);

    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading = false;
    }
  }

  onButDelete(index, event) {
    this.presentDeleteConfirm(index);

    event.stopPropagation();
    return false;
  }

  async presentDeleteConfirm(index) {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this buyer?',
      message: 'The buyer will be removed permanently from favourites',
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
            this.doDeleteBuyer(index);
          }
        }
      ]
    });

    await alert.present();
  }

  private doDeleteBuyer(index) {
    if (!this.seller) {
      return;
    }

    const buyer = this.buyers[index];

    const dbRef = FirebaseManager.ref();
    const propId = this.seller.propertyId;

    // remove db for favourite properties
    dbRef.child(Favourite.TN_FAVOURITE_PROPERTY)
      .child(propId)
      .child(buyer.id)
      .remove();

    // remove db for favourite buyers
    dbRef.child(Favourite.TN_FAVOURITE_BUYER)
      .child(buyer.id)
      .child(propId)
      .remove();

    // remove db for favourite sellers
    dbRef.child(Favourite.TN_FAVOURITE_SELLER)
      .child(this.sellerId)
      .child(buyer.id)
      .remove();

    // remove from list
    this.buyers.splice(index, 1);
  }
}
