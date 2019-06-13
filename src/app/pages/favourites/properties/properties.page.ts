import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Property} from '../../../models/property';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {GeoFire} from 'geofire';
import {BasePropertiesPage} from '../../base-properties.page';
import {NavService} from '../../../services/nav.service';
import {FirebaseManager} from '../../../helpers/firebase-manager';
import {Favourite} from '../../../models/favourite';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage extends BasePropertiesPage implements OnInit {

  showLoading = true;

  buyerId = '';
  props: Array<Property> = [];

  constructor(
    private route: ActivatedRoute,
    public alertController: AlertController,
    public auth: AuthService,
    public nav: NavService,
    public api: ApiService,
  ) {
    super(auth, nav);

    this.buyerId = this.route.snapshot.params['buyerId'];
  }

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    try {
      // fetch all properties
      this.props = await this.api.getFavouritePropertiesOfBuyer(this.buyerId);

      // set distance
      if (this.auth.user.lat && this.auth.user.lng) {
        for (const p of this.props) {
          if (!p.location) {
            continue;
          }

          p.distance = GeoFire.distance(p.location, [
            this.auth.user.lat,
            this.auth.user.lng
          ]);
        }
      }

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
      header: 'Are you sure remove this item?',
      message: 'The item will be removed permanently from favourites',
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
            this.doDeleteProperty(index);
          }
        }
      ]
    });

    await alert.present();
  }

  private doDeleteProperty(index) {
    const prop = this.props[index];

    const dbRef = FirebaseManager.ref();

    // remove db for favourite properties
    dbRef.child(Favourite.TN_FAVOURITE_PROPERTY)
      .child(prop.id)
      .child(this.buyerId)
      .remove();

    // remove db for favourite buyers
    dbRef.child(Favourite.TN_FAVOURITE_BUYER)
      .child(this.buyerId)
      .child(prop.id)
      .remove();

    // remove db for favourite sellers
    dbRef.child(Favourite.TN_FAVOURITE_SELLER)
      .child(prop.sellerId)
      .child(this.buyerId)
      .remove();

    // remove from list
    this.props.splice(index, 1);
  }
}
