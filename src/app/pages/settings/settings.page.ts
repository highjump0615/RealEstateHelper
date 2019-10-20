import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController, AlertController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import {config} from '../../helpers/config';
import {AppRate} from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {User} from "../../models/user";
import {ApiService} from "../../services/api/api.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  static SHARE_FACEBOOK = 0;
  static SHARE_TWITTER = 1;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private auth: AuthService,
    private appRate: AppRate,
    public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    public api: ApiService,
  ) { }

  ngOnInit() {
  }

  onSignout() {
    this.presentLogoutConfirm();

    // back to login page
    // this.router.navigate(['login']);
  }

  async presentLogoutConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure to log out?',
      buttons: [
        {
          text: 'Cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.doLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private doLogout() {
    // clear fcm token
    this.api.saveToDatabaseWithField(this.auth.user, User.FIELD_TOKEN, null);

    // sign out
    this.auth.signOut();

    this.navCtrl.navigateRoot('/login');
  }

  onRateApp() {
    // set certain preferences
    this.appRate.preferences.storeAppURL = {
      ios: config.appleId,
      android: `market://details?id=${config.packageName}`,
    };

    this.appRate.promptForRating(true);
  }

  async shareApp(type) {
    const shareText = 'Check out this great App!';
    const shareUrl = 'https://ionicacademy.com';

    try {
      if (type === SettingsPage.SHARE_FACEBOOK) {
        await this.socialSharing.shareViaFacebook(
          shareText,
          null,
          shareUrl
        );
      }
      else {
        await this.socialSharing.shareViaTwitter(
          shareText,
          null,
          shareUrl
        );
      }

      // show notice
      const toast = await this.toastController.create({
        color: 'dark',
        message: 'App has been shared successfully.',
        duration: 2000
      });
      toast.present();

    } catch (e) {
      console.log(e);
    }

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Facebook',
        handler: () => {
          this.shareApp(SettingsPage.SHARE_FACEBOOK);
        }
      }, {
        text: 'Twitter',
        handler: () => {
          this.shareApp(SettingsPage.SHARE_TWITTER);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  onShare() {
    this.presentActionSheet();
  }
}
