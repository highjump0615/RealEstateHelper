import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {GeoFire} from 'geofire';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {Property} from '../../models/property';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {ApiService} from '../../services/api/api.service';
import {TabService} from '../../services/tab.service';
import {TabsPage} from '../tabs/tabs.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  showLoading = true;

  properties: Array<Property>;

  lat: number;
  lng: number;

  constructor(
    private router: Router,
    private geolocation: Geolocation,
    private auth: AuthService,
    public api: ApiService,
    private tab: TabService
  ) { }

  ngOnInit() {

    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_HOME, this);

    this.geolocation.getCurrentPosition()
      .then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;

        this.fetchData();
      })
      .catch((error) => {
        console.log('Error getting location', error);

        this.fetchData();
      });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');

    // add newly added property when appear
    if (this.properties) {
      this.filterData(this.auth.user.propAll);
    }
  }

  filterData(props) {
    if (!props) {
      return;
    }

    // sort properties by distance
    if (this.lat && this.lng) {
      for (const p of props) {
        if (p.location) {
          p.distance = GeoFire.distance(p.location, [this.lat, this.lng]);
        }
      }

      props.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    }

    this.properties = props;
    this.auth.user.propAll = props;
  }

  async fetchData() {
    try {
      // fetch all properties
      const props = await this.api.getAllProperties();
      this.filterData(props);

      this.showLoading = false;

      return Promise.resolve();

    } catch (err) {
      console.log(err);

      this.showLoading = false;
    }
  }

  onProperyItem() {
    this.router.navigate(['property']);
  }

  async doRefresh(event) {
    await this.fetchData();

    event.target.complete();
  }
}
