import {BasePage} from './base.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import {AuthService} from '../services/auth/auth.service';
import {User} from '../models/user';
import {ApiService} from '../services/api/api.service';
import {config} from '../helpers/config';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Router} from '@angular/router';

export class BaseSigninPage extends BasePage {

  SIGNIN_EMAIL = 0;
  SIGNIN_FACEBOOK = 1;
  SIGNIN_GOOGLE = 2;

  signinMethod = this.SIGNIN_EMAIL;

  constructor(
    public fb: Facebook,
    public googlePlus: GooglePlus,
    public auth: AuthService,
    public api: ApiService,
    public router: Router,
    public navCtrl: NavController,
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController,
  ) {
    super(loadingCtrl, alertCtrl);
  }

  async onButFacebook() {
    this.signinMethod = this.SIGNIN_FACEBOOK;

    await this.showLoadingView();

    try {
      const res = await this.fb.login(['public_profile', 'email']);

      console.log('Logged into Facebook!', res);

      const facebookCredential = firebase.auth
        .FacebookAuthProvider
        .credential(res.authResponse.accessToken);

      // get user profile info
      const profile = await this.fb.api('me?fields=first_name,last_name,picture.width(360).height(360).as(picture_large)', []);
      console.log(profile);

      this.continueSocialSignIn(
        facebookCredential,
        profile['first_name'],
        profile['last_name'],
        profile['picture_large']['data']['url']);

    } catch (err) {
      console.log(err.code);

      this.onSocialError(err);
      return;
    }
  }

  async onButGoogle() {
    this.signinMethod = this.SIGNIN_GOOGLE;

    await this.showLoadingView();

    try {
      const res = await this.googlePlus.login({
        'webClientId': config.webClientId,
        'offline': true
      });

      console.log('Logged into Google!', res);

      const googleCredential = firebase.auth.GoogleAuthProvider.credential(res['idToken']);
      console.log(googleCredential);

      this.continueSocialSignIn(
        googleCredential,
        res['givenName'],
        res['familyName'],
        res['imageUrl']);

    } catch (err) {
      this.onSocialError(err);
      return;
    }

  }

  setUser(u) {
    this.auth.user = u;
    this.auth.updateCurrentUser();

    // go to main page
    this.navCtrl.navigateRoot(['/tabs/home']);
    this.showLoadingView(false);
  }

  async onSocialError(err) {
    console.log(err);

    let strTitle = 'Google Login Failed';
    if (this.signinMethod === this.SIGNIN_FACEBOOK) {
      strTitle = 'Facebook Login Failed';
    }

    if (this.signinMethod === this.SIGNIN_FACEBOOK &&
      err.errorCode === '4201') {
      // canceled
    }
    else {
      // show error alert
      const alert = await this.alertCtrl.create({
        header: strTitle,
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
    }

    this.showLoadingView(false);
  }

  onError(err) {
    console.log(JSON.stringify(err));

    this.showLoadingView(false);

    // show error alert
    this.presentAlert('Login Failed', err.message);
  }

  private async continueSocialSignIn(credential, firstName, lastName, photoUrl) {
    let userRes = null;

    try {
      userRes = await this.auth.socialSignIn(credential);
      console.log(userRes);

    } catch (err) {
      this.onSocialError(err);
      return;
    }

    try {
      // fetch user info
      const u = await this.api.getUserWithId(userRes.uid);
      console.log(u);

      if (u.type === User.USER_TYPE_ADMIN) {
        this.onError(new Error('Admin user cannot be used in the app'));
        return;
      }

      this.setUser(u);

    } catch (err) {
      console.log(err);

      if (err.name === 'not-found') {
        const newUser = new User(userRes.uid);

        newUser.email = userRes.email;
        newUser.name = `${firstName} ${lastName}`;
        newUser.photoUrl = photoUrl;
        newUser.saved = false;

        this.auth.user = newUser;

        // social login, go to signup profile page
        this.router.navigate(['signup-profile', {
          socialLogin: true,
        }]);

        return;
      }

      this.onError(err);
    }
    finally {
      this.showLoadingView(false);
    }
  }
}
