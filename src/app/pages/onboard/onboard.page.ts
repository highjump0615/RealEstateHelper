import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  static KEY_SHOWN = 'onboard_shown';

  @ViewChild('slides') slides;

  constructor(
    public navCtrl: NavController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  /**
   * next button
   * @param event
   */
  onButNext(event) {
    this.slides.isEnd().then((result) => {
      if (result) {
        this.gotoLoginPage();
        return;
      }

      // go to next slide
      this.slides.slideNext();
    });
  }

  /**
   * skip button
   * @param event
   */
  onButSkip(event) {
    this.gotoLoginPage();
  }

  /**
   * go to log in page
   */
  gotoLoginPage() {
    // set onboard flag
    this.storage.set(OnboardPage.KEY_SHOWN, true);

    this.navCtrl.navigateRoot(['']);
  }
}
