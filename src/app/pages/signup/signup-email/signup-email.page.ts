import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Utils} from '../../../helpers/utils';
import {ApiService} from '../../../services/api/api.service';
import {BaseSigninPage} from '../../base-signin.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth/auth.service';
import {Facebook} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.page.html',
  styleUrls: ['./signup-email.page.scss'],
})
export class SignupEmailPage extends BaseSigninPage implements OnInit {

  email = '';
  isExisting = true;

  constructor(
    public router: Router,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthService,
    public api: ApiService,
    public fb: Facebook,
    public googlePlus: GooglePlus,
  ) {
    super(fb, googlePlus, auth, api, router, navCtrl, loadingCtrl, alertCtrl);
  }

  ngOnInit() {
  }

  onButNext($event: MouseEvent) {
    this.router.navigate(['signup-password', {
      email: this.email
    }]);
  }

  onButSignin($event: MouseEvent) {
    // go to login page
    this.router.navigate(['login']);
  }

  onChangeEmail() {
    this.isExisting = true;

    if (this.isValid()) {
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

  isValid() {
    return Utils.isEmailValid(this.email);
  }
}
