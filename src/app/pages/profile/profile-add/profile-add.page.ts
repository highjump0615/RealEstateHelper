import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';
import {AlertController} from '@ionic/angular';
import {KeyboardService} from '../../../services/keyboard/keyboard.service';
import {Property} from '../../../models/property';

@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.page.html',
  styleUrls: ['./profile-add.page.scss'],
})
export class ProfileAddPage extends BaseSegmentPage implements OnInit {
  isAddressVisible = false;

  alertSelect: any;

  constructor(
    public alertController: AlertController,
    private kbService: KeyboardService
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

  onFocusStyle() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.STYLES) {
      inputs.push({
        type: 'checkbox',
        label: s,
        value: s
      });
    }

    this.presentSelectAlert('Select Style', inputs);
  }

  async presentSelectAlert(title, inputs) {
    this.alertSelect = await this.alertController.create({
      header: title,
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');

            this.onCloseSelectAlert();
          }
        }, {
          text: 'OK',
          handler: (data) => {
            console.log(data);

            this.onCloseSelectAlert();
          }
        }
      ]
    });

    await this.alertSelect.present();
  }

  onCloseSelectAlert() {
    // clear
    this.alertSelect = null;
  }

  onFocusType() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.TYPES) {
      inputs.push({
        type: 'checkbox',
        label: s,
        value: s
      });
    }

    this.presentSelectAlert('Select Type', inputs);
  }

  onFocusStatus() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.STATUSES) {
      inputs.push({
        type: 'checkbox',
        label: s,
        value: s
      });
    }

    this.presentSelectAlert('Select Status', inputs);
  }
}
