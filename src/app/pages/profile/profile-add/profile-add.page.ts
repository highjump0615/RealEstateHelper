import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from "../../base-segment.page";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.page.html',
  styleUrls: ['./profile-add.page.scss'],
})
export class ProfileAddPage extends BaseSegmentPage implements OnInit {
  isAddressVisible = false;

  constructor(
    public alertController: AlertController
  ) {
    super();
  }

  ngOnInit() {
  }

  onAddressChecked(event) {
    if (this.isAddressVisible) {
      this.presentAddressVisibleConfirm();
    }
  }

  async presentAddressVisibleConfirm() {
    const alert = await this.alertController.create({
      message: 'All property addresses will be shown to all users. To hide property address from all users, click box below.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // canceled
            this.isAddressVisible = false;
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
