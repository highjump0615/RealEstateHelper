import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BasePage} from '../base.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import {Utils} from '../../helpers/utils';
import {User} from '../../models/user';
import {ApiService} from '../../services/api/api.service';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {config} from '../../helpers/config';
import {BaseSigninPage} from '../base-signin.page';
// import {Facebook} from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseSigninPage implements OnInit {

  email = '';
  password = '';

  constructor(
    public router: Router,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthService,
    public api: ApiService,
    // public fb: Facebook,
    public googlePlus: GooglePlus,
  ) {
    // super(fb, googlePlus, auth, api, router, navCtrl, loadingCtrl, alertCtrl);
    super(googlePlus, auth, api, router, navCtrl, loadingCtrl, alertCtrl);
  }

  ngOnInit() {
  }

  onButForget($event: MouseEvent) {
    this.router.navigate(['forget']);
  }

  onButLogin($event: MouseEvent) {
    this.signinMethod = this.SIGNIN_EMAIL;

    if (!Utils.isEmailValid(this.email)) {
      this.presentAlert(
        'Email Invalid',
        'Please enter valid email address'
      );

      return;
    }

    this.showLoadingView();

    // log in
    this.auth.signIn(
      this.email,
      this.password
    ).then( (user) => {

      // fetch user info from db
      this.api.getUserWithId(user.uid)
        .then((u) => {
          if (u.type === User.USER_TYPE_ADMIN) {
            this.onError(new Error('Admin user cannot be used in the app'));
          }

          this.setUser(u);
        })
        .catch((err) => {
          this.onError(err);
        });

    }).catch((err) => {
      console.log(err);

      this.onError(err);
    });
  }
}
