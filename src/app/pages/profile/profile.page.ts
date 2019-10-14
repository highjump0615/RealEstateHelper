import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {ApiService} from '../../services/api/api.service';
import {NavService} from '../../services/nav.service';
import {AlertController, ToastController} from '@ionic/angular';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId = '';
  user: User;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public router: Router,
    public api: ApiService,
    public nav: NavService,
    public auth: AuthService,
    public callNumber: CallNumber,
    public emailComposer: EmailComposer
  ) {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId) {
      // fetch user
      this.api.getUserWithId(this.userId)
        .then((user) => {
          this.user = user;
        });
    } else {
      // me
      this.user = this.auth.user;
    }
  }

  ngOnInit() {
  }

  onButEdit() {
    this.router.navigate(['signup-profile', this.auth.user.id]);
  }

  onButChat() {
    // only available after user is fetched
    if (!this.user) {
      return;
    }

    this.nav.push('message', {
      data: this.user
    });
  }

  async onButReport() {
    const alert = await this.alertController.create({
      header: 'Report',
      inputs: [
        {
          name: 'report',
          type: 'text',
          placeholder: 'Input content here...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log('Confirm Ok');

            this.doReport(alertData.report);
          }
        }
      ]
    });

    await alert.present();
  }

  async doReport(content) {
    if (!content) {
      return;
    }

    // show notice
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'The user has been reported',
      duration: 2000
    });
    toast.present();
  }

  onButPhone(phone) {
    this.callNumber.callNumber(phone, true);
  }

  onButEmail(email) {
    const emailData = {
      to: email,
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(emailData);
  }

  goToLocation(client, event) {
    this.router.navigate(['/location', {
      location: client.getLocation()
    }]);

    event.stopPropagation();
    return false;
  }
}
