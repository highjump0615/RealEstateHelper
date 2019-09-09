import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {BasePage} from '../../base.page';
import {AlertController, LoadingController, NavController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage extends BasePage implements OnInit {

  passwordCurrent = '';
  passwordNew = '';
  rePassword: string;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    private auth: AuthService,
    public navCtrl: NavController,
  ) {
    super(loadingCtrl, alertCtrl);
  }

  ngOnInit() {
  }

  isMatchPassword() {
    if (!this.passwordNew) {
      return false;
    }

    return this.passwordNew === this.rePassword;
  }

  async onButDone() {
    // check validity
    if (!this.passwordCurrent) {
      this.presentAlert(
        'Input Current Password',
        'Current password cannot be empty'
      );
      return;
    }

    this.showLoadingView();

    try {
      await this.auth.changePassword(
        this.passwordCurrent,
        this.passwordNew
      );

      // show notice
      const toast = await this.toastController.create({
        color: 'dark',
        message: 'Password has been change successfully',
        duration: 2000
      });
      toast.present();

      // back to prev page
      this.navCtrl.pop();

    } catch (e) {
      console.log(e);

      let msg = e.message;
      if (e.code === 'auth/wrong-password') {
        msg = 'Current password is not correct';
      }

      this.presentAlert(
        'Failed Change Password',
        msg
      );
    }

    this.showLoadingView(false);
  }
}
