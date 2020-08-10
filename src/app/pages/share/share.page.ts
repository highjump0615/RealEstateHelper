import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {Utils} from '../../helpers/utils';
import {BaseKeyboardPage} from '../base-keyboard.page';
import {KeyboardService} from '../../services/keyboard/keyboard.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage extends BaseKeyboardPage implements OnInit {
  email = '';
  propId = '';

  constructor(
    public navCtrl: NavController,
    public kbService: KeyboardService,
    public platform: Platform,
    public keyboard: Keyboard,
    public api: ApiService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController,
  ) {
    super(kbService, platform, keyboard, loadingCtrl, alertCtrl);
  }

  ngOnInit() {
    this.propId = this.route.snapshot.params['propId'];
  }

  async onButShare() {
    // check email validity
    if (!Utils.isEmailValid(this.email)) {
      // show error alert
      const alert = await this.alertCtrl.create({
        header: 'Invalid email address',
        message: 'Cannot be sent to that email',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    await this.showLoadingView();

    try {
      await this.api.sendShareProperty(this.email, this.propId);

      // show notice
      const toast = await this.toastController.create({
        color: 'dark',
        message: 'Email has been sent successfully.',
        duration: 2000
      });
      toast.present();

      // back to prev page
      this.navCtrl.pop();

    } catch (err) {
      // show error alert
      this.presentAlert('Failed to Send Email', err.message);
    }

    this.showLoadingView(false);
  }
}
