import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BasePage} from '../base.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import {Utils} from '../../helpers/utils';
import {User} from '../../models/user';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePage implements OnInit {

  email = '';
  password = '';

  SIGNIN_EMAIL = 0;
  SIGNIN_FACEBOOK = 1;
  SIGNIN_GOOGLE = 2;

  signinMethod = this.SIGNIN_EMAIL;

  constructor(
    private router: Router,
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

  setUser(u) {
    this.auth.user = u;
    this.auth.updateCurrentUser();

    // go to main page
    this.navCtrl.navigateRoot(['/tabs/home']);
    this.showLoadingView(false);
  }

  onError(err) {
    console.log(JSON.stringify(err));

    this.showLoadingView(false);

    // show error alert
    this.presentAlert('Login Failed', err.message);
  }
}
