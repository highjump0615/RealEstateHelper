import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {OnboardPage} from './pages/onboard/onboard.page';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import {AuthService} from './services/auth/auth.service';
import {FirebaseManager} from './helpers/firebase-manager';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  static KEY_USER = 'current_user';

  homePage = 'onboard';

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // init firebase
    if (FirebaseManager.getInstance()) {
      console.log('firebase loaded');
    }

    this.platform.ready().then(() => {
      // set current user from session storage
      this.storage.get(AppComponent.KEY_USER)
        .then((val) => {
          if (val) {
            this.auth.user = new User().deserialize(val);

            this.homePage = 'tabs/home';
            this.finalizeInit();

            return;
          }

          this.showOnboard();
        })
        .catch((err) => {
          console.log(err);

          this.showOnboard();
        });
    });
  }

  showOnboard() {
    //
    // check onbaord shown status
    //
    this.storage.get(OnboardPage.KEY_SHOWN)
      .then((shown) => {
        if (shown) {
          this.homePage = 'signup-email';
        }

        this.finalizeInit();
      })
      .catch((err) => {
        console.log(err);

        this.finalizeInit();
      });
  }

  finalizeInit() {
    // go to home page
    this.router.navigate([this.homePage]);

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
