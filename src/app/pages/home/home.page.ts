import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {GeoFire} from 'geofire';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {Property} from '../../models/property';
import {Geolocation, GeolocationOptions} from '@ionic-native/geolocation/ngx';
import {ApiService} from '../../services/api/api.service';
import {TabService} from '../../services/tab.service';
import {TabsPage} from '../tabs/tabs.page';
import {NavService} from '../../services/nav.service';
import {BasePropertiesPage} from '../base-properties.page';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePropertiesPage implements OnInit {
  showLoading = true;

  properties: Array<Property>;

  constructor(
    private router: Router,
    private geolocation: Geolocation,
    public auth: AuthService,
    public api: ApiService,
    public nav: NavService,
    private tab: TabService,
    private platform: Platform,
  ) {
    super(auth, nav);
  }

  async ngOnInit() {

    console.log('on init');

    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_HOME, this);

    await this.platform.ready();

    try {
      const options: GeolocationOptions = {
        maximumAge: 1000,
        timeout: 1000,
      };

      const resp = await this.geolocation.getCurrentPosition(options);
      this.auth.user.lat = resp.coords.latitude;
      this.auth.user.lng = resp.coords.longitude;

    } finally {
      this.fetchData();
    }
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
    if (this.auth.user.lat && this.auth.user.lng) {
      for (const p of props) {
        if (!p.location) {
          continue;
        }

        p.distance = GeoFire.distance(p.location, [
          this.auth.user.lat,
          this.auth.user.lng
        ]);
      }

      // sort by distance
      props.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    }

    // sort by time
    props.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);

    this.properties = props;
    this.auth.user.propAll = props;
  }

  async fetchData() {
    console.log('fetch start');

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

    console.log('fetch done');
  }

  async doRefresh(event) {
    await this.fetchData();

    event.target.complete();
  }

  onButAddProfile() {
    this.nav.push('profile-add');
  }
}
