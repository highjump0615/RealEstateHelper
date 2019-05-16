import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {FirebaseManager} from '../../../helpers/firebase-manager';
import {Favourite} from '../../../models/favourite';
import {Property} from '../../../models/property';
import {NavService} from '../../../services/nav.service';

@Component({
  selector: 'app-select-buyer',
  templateUrl: './select-buyer.page.html',
  styleUrls: ['./select-buyer.page.scss'],
})
export class SelectBuyerPage implements OnInit {

  showLoading = false;

  property: Property;
  buyerIds = [];

  constructor(
    public navCtrl: NavController,
    public nav: NavService,
    private auth: AuthService,
    public api: ApiService,
  ) {
    // get parameter
    this.property = this.nav.get('data');
  }

  async ngOnInit() {

    try {
      if (!this.auth.user.buyers) {
        this.showLoading = true;

        this.auth.user.buyers = await this.api.fetchClients(true);
        console.log(this.auth.user.buyers);
      }

      // fetch favourite buyers of this property
      this.buyerIds = await this.api.fetchFavouriteBuyersOfProperty(this.property.id);

      for (const b of this.auth.user.buyers) {
        if (this.buyerIds.findIndex((id) => id === b.id) < 0) {
          continue;
        }

        // update select status
        b.selected = true;
      }

    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading = false;
    }
  }

  onButNext() {
    const dbRef = FirebaseManager.ref();

    // clear original data
    dbRef.child(Favourite.TN_FAVOURITE_PROPERTY)
      .child(this.property.id)
      .remove();

    dbRef.child(Favourite.TN_FAVOURITE_SELLER)
      .child(this.property.sellerId)
      .remove();

    // clear original data
    for (const bId of this.buyerIds) {
      // remove from db
      dbRef.child(Favourite.TN_FAVOURITE_BUYER)
        .child(bId)
        .remove();
    }

    // add new data
    for (const b of this.auth.user.buyers) {
      if (b.selected) {
        // save for property
        dbRef.child(Favourite.TN_FAVOURITE_PROPERTY)
          .child(this.property.id)
          .child(b.id)
          .set(true);

        dbRef.child(Favourite.TN_FAVOURITE_SELLER)
          .child(this.property.sellerId)
          .child(b.id)
          .set(true);

        // save for buyer
        dbRef.child(Favourite.TN_FAVOURITE_BUYER)
          .child(b.id)
          .child(this.property.id)
          .set(true);
      }
    }

    // back to prev page
    this.navCtrl.pop();
  }
}
