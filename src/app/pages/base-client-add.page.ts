import {BaseSegmentPage} from './base-segment.page';
import {AlertController, LoadingController} from '@ionic/angular';
import {Property} from '../models/property';
import {PropertyService} from '../services/property/property.service';

export class BaseClientAddPage extends BaseSegmentPage {

  alertSelect: any;

  priceMin: number;
  priceMax: number;

  styles = [];
  types = [];

  sizeMin: number;
  sizeMax: number;

  bedroom: number;
  bathroom: number;

  frontage: number;
  depth: number;

  basement =  '';
  constStatus = '';
  garage = '';

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
  ) {
    super(loadingCtrl, alertCtrl);
  }

  getStyles() {
    return this.styles.join(', ');
  }

  getTypes() {
    return this.types.join(', ');
  }

  onFocusStyle() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.STYLES) {
      const item = {
        type: 'checkbox',
        label: s,
        value: s
      };

      // set initial checked
      if (this.styles.indexOf(s) >= 0) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Style',
      inputs,
      (data) => {
        this.styles = data;
      });
  }

  async presentSelectAlert(title, inputs, onOk = (data) => {}) {
    this.alertSelect = await this.alertCtrl.create({
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

            // callback
            onOk(data);

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
      const item = {
        type: 'checkbox',
        label: s,
        value: s
      };

      // set initial checked
      if (this.types.indexOf(s) >= 0) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Type',
      inputs,
      (data) => {
        this.types = data;
      });
  }

  onFocusStatus() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.STATUSES) {
      const item = {
        type: 'radio',
        label: s,
        value: s
      };

      // set initial checked
      if (this.constStatus === s) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Status',
      inputs,
      (data) => {
        this.constStatus = data;
      });
  }

  onFocusBasement() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.BASEMENT) {
      const item = {
        type: 'radio',
        label: s,
        value: s
      };

      // set initial checked
      if (this.basement === s) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Garage',
      inputs,
      (data) => {
        this.basement = data;
      });
  }

  onFocusGarage() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    const inputs = [];
    for (const s of Property.GARAGES) {
      const item = {
        type: 'radio',
        label: s,
        value: s
      };

      // set initial checked
      if (this.garage === s) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Garage',
      inputs,
      (data) => {
        this.garage = data;
      });
  }

  onFocusLocation() {
    // go to map page
    this.propService.gotoMapForLocation();
  }
}
