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
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {User} from '../../models/user';
import {Notification} from '../../models/notification';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import {PropertyHelper} from '../../helpers/property-helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePropertiesPage implements OnInit {
  showLoading = true;

  properties: Array<Property>;

  // temporary data
  latitude = 0;
  longitude = 0;
  fcmToken = '';

  constructor(
    private router: Router,
    private geolocation: Geolocation,
    public auth: AuthService,
    public api: ApiService,
    public nav: NavService,
    private tab: TabService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private firebase: FirebaseX,
  ) {
    super(auth, nav);
  }

  async ngOnInit() {

    console.log('on init');

    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_HOME, this);

    await this.platform.ready();

    this.splashScreen.hide();

    //
    // get location
    //
    try {
      const options: GeolocationOptions = {
        maximumAge: 1000,
        timeout: 1000,
      };

      const resp = await this.geolocation.getCurrentPosition(options);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

    } catch (e) {
      console.log(e);
    }

    this.fetchData();

    this.firebase.onMessageReceived()
      .subscribe(data => {
        console.log(`User opened a notification`);
        console.log(data);

        if (data.tap === 'background') {
          //
          // parse data
          //
          const type = data.type;
          if (data.type === Notification.NOTIFICATION_CHAT) {
            // go to chat message page
            this.router.navigate(['/message', data.userId]);
          } else {
            // go to notifications page
            this.router.navigate(['/tabs/notifications']);
          }
        }
      });

    this.firebase.onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);

        if (!this.auth.user) {
          return;
        }

        this.saveToken(token);
      });
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter');

    if (this.auth.user) {
      if (this.auth.user) {
        this.auth.user.lat = this.latitude;
        this.auth.user.lng = this.longitude;
      }

      // already got fcm token
      if (this.fcmToken) {
        return;
      }

      // push notification related
      try {
        console.log('init for push notification');

        const perm = await this.firebase.grantPermission();
        console.log('grantPermission', perm);

        const token = await this.firebase.getToken();
        console.log(`The token is ${token}`);

        this.fcmToken = token;

        this.saveToken(token);
      } catch (e) {
        console.log(e);
      }
    }

    // add newly added property when appear
    if (this.properties && this.auth.user) {
      if (this.auth.user.propAll.length <= 0) {
        // init prop all with current values
        this.auth.user.propAll = this.properties;
      }
      else {
        this.filterData(this.auth.user.propAll);
      }
    }
  }

  saveToken(token) {
    this.auth.user.fcmToken = token;
    this.auth.updateCurrentUser();

    // save to db
    this.api.saveToDatabaseWithField(this.auth.user, User.FIELD_TOKEN, token);
  }

  filterData(props) {
    if (!props) {
      return;
    }

    // sort properties by distance
    if (this.latitude && this.longitude) {
      for (const p of props) {
        if (!p.location) {
          continue;
        }

        p.distance = GeoFire.distance(p.location, [
          this.latitude,
          this.longitude
        ]);
      }

      // sort by distance
      props.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    }

    // sort by time
    props.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);

    this.properties = props;

    if (this.auth.user) {
      this.auth.user.propAll = props;
    }
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

  getPropertyImage(property) {
    return PropertyHelper.getPropertyImage(property);
  }
}
