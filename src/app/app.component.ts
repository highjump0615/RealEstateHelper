import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {OnboardPage} from './pages/onboard/onboard.page';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  homePage = 'onboard';

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
    });
  }

  finalizeInit() {
    // go to home page
    this.router.navigate([this.homePage]);

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
