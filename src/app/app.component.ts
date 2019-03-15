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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
