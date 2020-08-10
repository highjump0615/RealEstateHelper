import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {FirebaseManager} from '../../../helpers/firebase-manager';
import {Favourite} from '../../../models/favourite';
import {Property} from '../../../models/property';
import {NavService} from '../../../services/nav.service';
import {BasePage} from '../../base.page';


@Component({
  selector: 'app-select-buyer',
  templateUrl: './select-buyer.page.html',
  styleUrls: ['./select-buyer.page.scss'],
})
export class SelectBuyerPage extends BasePage implements OnInit {

  showLoading = false;

  property: Property;
  buyerIds = [];

  constructor(
    public navCtrl: NavController,
    public nav: NavService,
    public auth: AuthService,
    public api: ApiService,
    public loadingCtrl: LoadingController,
  ) {
    super(loadingCtrl);

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

  async onButNext() {
    await this.showLoadingView();

    const dbRef = FirebaseManager.ref();

    // clear original data
    const proms = [];
    for (const b of this.auth.user.buyers) {
      // remove from db
      let prom = dbRef.child(Favourite.TN_FAVOURITE_PROPERTY)
        .child(this.property.id)
        .child(b.id)
        .remove();
      proms.push(prom);

      prom = dbRef.child(Favourite.TN_FAVOURITE_SELLER)
        .child(this.property.sellerId)
        .child(b.id)
        .remove();
      proms.push(prom);

      prom = dbRef.child(Favourite.TN_FAVOURITE_BUYER)
        .child(b.id)
        .child(this.property.id)
        .remove();
      proms.push(prom);
    }
    await Promise.all(proms);

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

    // hide loading
    this.showLoadingView(false);

    // back to prev page
    this.navCtrl.pop();
  }
}
