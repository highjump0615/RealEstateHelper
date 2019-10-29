import {AfterViewInit, Component} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {OnboardPage} from './pages/onboard/onboard.page';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import {AuthService} from './services/auth/auth.service';
import {FirebaseManager} from './helpers/firebase-manager';
import {User} from './models/user';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent implements AfterViewInit {

  homePage = 'onboard';

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('built in 09271556');

    // init firebase
    if (FirebaseManager.getInstance()) {
      console.log('firebase loaded');
    }

    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      console.log('ready');
    });
  }

  ngAfterViewInit() {
    // This element never changes.
    const ionapp = document.getElementsByTagName('ion-app')[0];

    window.addEventListener('keyboardDidShow', async (event) => {
      // Move ion-app up, to give room for keyboard
      const kbHeight: number = event['keyboardHeight'];
      const viewportHeight: number = $(window).height();
      const inputFieldOffsetFromBottomViewPort: number = viewportHeight - $(':focus')[0].getBoundingClientRect().bottom;
      const inputScrollPixels = kbHeight - inputFieldOffsetFromBottomViewPort;

      // Set margin to give space for native keyboard.
      // ionapp.style['margin-bottom'] = kbHeight.toString() + 'px';

      // But this diminishes ion-content and may hide the input field...
      if (inputScrollPixels > 0) {
        // ...so, get the ionScroll element from ion-content and scroll correspondingly
        // The current ion-content element is always the last. If there are tabs or other hidden ion-content elements, they will go above.
        const ionScroll = await $('ion-content').last()[0].getScrollElement();
        setTimeout(() => {
          $(ionScroll).animate({
            scrollTop: ionScroll.scrollTop + inputScrollPixels
          }, 200);
        }, 0); // Matches scroll animation from css.
      }
    });

    window.addEventListener('keyboardDidHide', () => {
      // Move ion-app down again
      // Scroll not necessary.
      // ionapp.style['margin-bottom'] = '0px';
    });
  }

}
