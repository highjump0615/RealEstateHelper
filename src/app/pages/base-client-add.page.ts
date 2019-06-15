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

  basements = [];
  constStatus = [];
  garages = [];

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
  ) {
    super(loadingCtrl, alertCtrl);

    // init prop service
    propService.address = '';
    propService.lat = null;
    propService.lng = null;
  }

  getStyles() {
    return this.styles.join(', ');
  }

  getTypes() {
    return this.types.join(', ');
  }

  getGarages() {
    return this.garages.join(', ');
  }

  getBasements() {
    return this.basements.join(', ');
  }

  getConstStatus() {
    return this.constStatus.join(', ');
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
        type: 'checkbox',
        label: s,
        value: s
      };

      // set initial checked
      if (this.constStatus.indexOf(s) >= 0) {
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
        type: 'checkbox',
        label: s,
        value: s
      };

      // set initial checked
      if (this.basements.indexOf(s) >= 0) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Basement',
      inputs,
      (data) => {
        this.basements = data;
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
        type: 'checkbox',
        label: s,
        value: s
      };

      // set initial checked
      if (this.garages.indexOf(s) >= 0) {
        item['checked'] = true;
      }

      inputs.push(item);
    }

    this.presentSelectAlert(
      'Select Garage',
      inputs,
      (data) => {
        this.garages = data;
      });
  }

  onFocusLocation() {
    // go to map page
    this.propService.gotoMapForLocation();
  }
}
