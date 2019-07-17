import { Component, OnInit } from '@angular/core';
import {BaseKeyboardPage} from '../base-keyboard.page';
import {KeyboardService} from '../../services/keyboard/keyboard.service';
import {AlertController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage extends BaseKeyboardPage implements OnInit {

  text = '';

  constructor(
    public navCtrl: NavController,
    public kbService: KeyboardService,
    public platform: Platform,
    public keyboard: Keyboard,
    public api: ApiService,
    public toastController: ToastController,
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController,
  ) {
    super(kbService, platform, keyboard, loadingCtrl, alertCtrl);
  }

  ngOnInit() {
  }

  async onButDone() {
    // not entered anyting, return
    if (!this.text) {
      return;
    }

    await this.showLoadingView();

    try {
      await this.api.sendFeedback(this.text);

      // show notice
      const toast = await this.toastController.create({
        color: 'dark',
        message: 'Your feedback has beent sent successfully.',
        duration: 2000
      });
      toast.present();

      // back to prev page
      this.navCtrl.pop();

    } catch (err) {
      // show error alert
      this.presentAlert('Failed to Send Feedback', err.message);
    }

    this.showLoadingView(false);
  }

}
