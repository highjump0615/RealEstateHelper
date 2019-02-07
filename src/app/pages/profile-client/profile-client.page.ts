import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from "../base-segment.page";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.page.html',
  styleUrls: ['./profile-client.page.scss'],
})
export class ProfileClientPage extends BaseSegmentPage implements OnInit {

  constructor(
    public alertController: AlertController
  ) {
    super();
  }

  ngOnInit() {
  }

  onButRemove() {
    this.presentRemoveConfirm();
  }

  async presentRemoveConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this profile?',
      message: 'This will be removed permanently from your profile list',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
