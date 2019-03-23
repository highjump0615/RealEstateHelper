import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private auth: AuthService
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
    // sign out
    this.auth.signOut();

    this.navCtrl.navigateRoot('/login');
  }
}
