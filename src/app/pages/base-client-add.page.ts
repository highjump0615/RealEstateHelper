import {BaseSegmentPage} from './base-segment.page';
import {AlertController, LoadingController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';
import {Property} from '../models/property';
import {PropertyService} from '../services/property/property.service';
import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';


export class BaseClientAddPage extends BaseSegmentPage {

  alertSelect: any;

  priceMin = '';
  priceMax = '';

  styles = [];
  types = [];

  sizeMin = '';
  sizeMax = '';

  bedroom: number;
  bathroom: number;

  frontage: number;
  depth: number;

  basements = [];
  constStatus = [];
  garages = [];

  numbersRoom = [];

  maskCurrency: any;
  maskSize: any;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
    public pickerCtrl?: PickerController,
  ) {
    super(loadingCtrl, alertCtrl);

    // init prop service
    propService.address = '';
    propService.lat = null;
    propService.lng = null;

    for (let i = 1; i <= 10; i++) {
      this.numbersRoom.push({
        text: i.toString(),
        value: i
      });
    }

    // text mask
    this.maskCurrency = createNumberMask({
      prefix: '$',
      thousandsSeparatorSymbol: ',',
      allowDecimal: true,
      decimalSymbol: '.'
    });

    this.maskSize = createNumberMask({
      prefix: '',
      suffix: ' sq ft.',
    });
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

  async onFocusBedroom() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    let indexCur = 0;
    if (this.bedroom) {
      indexCur = this.bedroom - 1;
    }

    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Clear',
          handler: (value: any): void => {
            this.bedroom = null;
          },
        },
        {
          text: 'Done',
          handler: (value: any): void => {
            console.log(value, 'ok');

            this.bedroom = value.bedroom.text;
          },
        }
      ],
      columns: [
        {
          name: 'bedroom',
          options: this.numbersRoom,
          selectedIndex: indexCur,
        }
      ]
    };

    this.alertSelect = await this.pickerCtrl.create(opts);
    this.alertSelect.present();
    this.alertSelect.onDidDismiss().then(async data => {
      const col = await this.alertSelect.getColumn('bedroom');

      //
      // fixing error of overlapping items from second show
      //
      col.options.forEach(element => {
        delete element.selected;
        delete element.duration;
        delete element.transform;
      });

      this.alertSelect = null;
    });
  }

  async onFocusBathroom() {
    // already opened select alert
    if (this.alertSelect) {
      return;
    }

    let indexCur = 0;
    if (this.bathroom) {
      indexCur = this.bathroom - 1;
    }

    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          handler: (value: any): void => {
            this.bathroom = null;
          },
        },
        {
          text: 'Done',
          handler: (value: any): void => {
            console.log(value, 'ok');

            this.bathroom = value.bathroom.text;
          },
        }
      ],
      columns: [
        {
          name: 'bathroom',
          options: this.numbersRoom,
          selectedIndex: indexCur,
        }
      ]
    };

    this.alertSelect = await this.pickerCtrl.create(opts);
    this.alertSelect.present();
    this.alertSelect.onDidDismiss().then(async data => {
      const col = await this.alertSelect.getColumn('bathroom');

      //
      // fixing error of overlapping items from second show
      //
      col.options.forEach(element => {
        delete element.selected;
        delete element.duration;
        delete element.transform;
      });

      this.alertSelect = null;
    });
  }

  unmask(val) {
    if (!val) {
      return '';
    }

    return val.toString().replace(/\D+/g, '');
  }
}
