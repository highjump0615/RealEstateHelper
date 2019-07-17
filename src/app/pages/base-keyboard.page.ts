import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {KeyboardService} from '../services/keyboard/keyboard.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {BasePage} from './base.page';

export class BaseKeyboardPage extends BasePage {

  constructor(
    public kbService: KeyboardService,
    public platform: Platform,
    public keyboard: Keyboard,
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController
  ) {
    super(loadingCtrl, alertCtrl);

    keyboard.setResizeMode('native');
  }

  ionViewDidLeave() {
    this.keyboard.setResizeMode('');
  }

  getMarginBottom() {
    if (this.platform.is('android')) {
      return `${this.kbService.keyboardHeight}px`;
    }

    return '0';
  }
}
