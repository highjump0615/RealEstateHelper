import { Component, OnInit } from '@angular/core';
import {Utils} from '../../helpers/utils';
import {ApiService} from '../../sercices/api/api.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import {BasePage} from '../base.page';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage extends BasePage implements OnInit {

  email = '';
  isExisting = false;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService,
    public api: ApiService
  ) {
    super(loadingCtrl, alertCtrl);
  }

  ngOnInit() {
  }

  onChangeEmail() {
    this.isExisting = false;

    if (Utils.isEmailValid(this.email)) {
      // check email existence
      this.api.checkUserExistingByEmail(this.email)
        .then((existing) => {
          this.isExisting = existing;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  onButSubmit(event) {
    this.showLoadingView();

    this.auth.resetPassword(this.email)
      .then(() => {
        this.showLoadingView(false);

        // show error alert
        this.presentAlert(
          'Password Reset email has been sent',
          'You can reset your password through your email',
          () => {
            this.navCtrl.pop();
          }
        );
      })
      .catch((err) => {
        this.showLoadingView(false);

        // show error alert
        this.presentAlert('Login Failed', err.message);
      });
  }
}
