import {BasePage} from './base.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import {AuthService} from '../services/auth/auth.service';
import {User} from '../models/user';
import {ApiService} from '../services/api/api.service';

export class BaseSigninPage extends BasePage {

  SIGNIN_EMAIL = 0;
  SIGNIN_FACEBOOK = 1;
  SIGNIN_GOOGLE = 2;

  signinMethod = this.SIGNIN_EMAIL;

  constructor(
    public fb: Facebook,
    public auth: AuthService,
    public api: ApiService,
    public navCtrl: NavController,
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController,
  ) {
    super(loadingCtrl, alertCtrl);
  }

  async onButFacebook() {
    this.signinMethod = this.SIGNIN_FACEBOOK;

    await this.showLoadingView();

    let res = null;
    let userRes = null;

    try {
      res = await this.fb.login(['public_profile', 'email']);

      console.log('Logged into Facebook!', res);

      const facebookCredential = firebase.auth
        .FacebookAuthProvider
        .credential(res.authResponse.accessToken);

      userRes = await this.auth.socialSignIn(facebookCredential);
      console.log(userRes);

    } catch (err) {
      let strTitle = 'Google Login Failed';
      if (this.signinMethod === this.SIGNIN_FACEBOOK) {
        strTitle = 'Facebook Login Failed';
      }

      // show error alert
      const alert = await this.alertCtrl.create({
        header: strTitle,
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
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
        const newUser = new User(userRes.id);

        newUser.email = userRes.email;
        newUser.name = `${res['givenName']} ${res['familyName']}`;
        newUser.photoUrl = res['imageUrl'];

        this.api.saveToDatabase(newUser);
        this.setUser(newUser);

        return;
      }

      this.onError(err);
    }
    finally {
      this.showLoadingView(false);
    }

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
