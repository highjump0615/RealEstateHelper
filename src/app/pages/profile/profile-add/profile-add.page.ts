import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {KeyboardService} from '../../../services/keyboard/keyboard.service';
import {Property} from '../../../models/property';
import {ImageUploaderComponent} from '../../../components/image-uploader/image-uploader.component';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {Client} from '../../../models/client';
import {ApiService} from '../../../services/api/api.service';
import {FirebaseManager} from '../../../helpers/firebase-manager';

@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.page.html',
  styleUrls: ['./profile-add.page.scss'],
})
export class ProfileAddPage extends BaseSegmentPage implements OnInit {

  @ViewChild('imagePhoto') uploadPhoto: ImageUploaderComponent;
  @ViewChild('mainForm') formMain: NgForm;

  alertSelect: any;

  // input data
  name = '';
  email = '';
  phone = '';

  priceMin: number;
  priceMax: number;
  price: number;

  location = '';
  address = '';
  isAddressVisible = false;

  title = '';

  styles = [];
  types = [];

  size: number;
  bedroom: number;
  bathroom: number;
  frontage: number;
  depth: number;

  basement =  '';
  constStatus = '';
  garage = '';

  description = '';
  descProp = '';

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService,
    public api: ApiService
  ) {
    super(loadingCtrl, alertCtrl);
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


  getStyles() {
    return this.styles.join(', ');
  }

  getTypes() {
    return this.types.join(', ');
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

  onButDone() {
    //
    // input valid
    //
    if (!this.name) {
      this.presentAlert(
        'Invalid Name',
        'Please enter buyer or seller name'
      );
      return;
    }

    if (!this.email) {
      this.presentAlert(
        'Invalid Email',
        'Please enter email address'
      );
      return;
    }

    if (!this.phone) {
      this.presentAlert(
        'Invalid Phone',
        'Please enter phone number'
      );
      return;
    }



    if (this.currentPage === this.PAGE_SELLER) {
      if (!this.uploadPhoto.picture) {
        this.presentAlert(
          'Image Not Selected',
          'Property Photo is needed to post seller data,'
        );

        return;
      }

      if (!this.price) {
        this.presentAlert(
          'Invalid Price',
          'Please enter price'
        );
        return;
      }

      if (!this.address) {
        this.presentAlert(
          'Invalid Address',
          'Please enter address'
        );
        return;
      }

      if (!this.title) {
        this.presentAlert(
          'Invalid Title',
          'Please enter property title'
        );
        return;
      }
    } else {
      // buyer

      if (!this.priceMin || !this.priceMax) {
        this.presentAlert(
          'Invalid Price',
          'Please enter price'
        );
        return;
      }
    }

    if (this.styles.length <= 0) {
      this.presentAlert(
        'Invalid Style',
        'Please select styles'
      );
      return;
    }

    if (this.types.length <= 0) {
      this.presentAlert(
        'Invalid Type',
        'Please select types'
      );
      return;
    }

    if (!this.size) {
      this.presentAlert(
        'Invalid Size',
        'Please input house size'
      );
      return;
    }

    if (!this.bedroom) {
      this.presentAlert(
        'Invalid Bedrooms',
        'Please input bedroom number'
      );
      return;
    }

    if (!this.bathroom) {
      this.presentAlert(
        'Invalid Bathrooms',
        'Please input bathroom number'
      );
      return;
    }

    if (!this.garage) {
      this.presentAlert(
        'Invalid Garage',
        'Please select garage info'
      );
      return;
    }

    if (!this.basement) {
      this.presentAlert(
        'Invalid Basement',
        'Please select basement info'
      );
      return;
    }

    if (!this.frontage) {
      this.presentAlert(
        'Invalid Lot Frontage',
        'Please input lot frontage'
      );
      return;
    }
    if (!this.depth) {
      this.presentAlert(
        'Invalid Lot Depth',
        'Please input lot depth'
      );
      return;
    }

    if (!this.constStatus) {
      this.presentAlert(
        'Invalid Status',
        'Please select construction status'
      );
      return;
    }

    this.formMain.ngSubmit.emit();
  }

  onSubmit() {
    console.log('submitting ...');

    this.showLoadingView();

    const user = this.auth.user;

    //
    // save data for client
    //

    // save property info
    const propNew = new Property();
    propNew.address = this.address;
    propNew.title = this.title;
    propNew.desc = this.descProp;
    propNew.style = this.styles;
    propNew.type = this.types;
    propNew.size = this.size;
    propNew.bedroom = this.bedroom;
    propNew.bathroom = this.bathroom;
    propNew.garage = this.garage;
    propNew.basement = this.basement;
    propNew.lotFrontage = this.frontage;
    propNew.lotDepth = this.depth;
    propNew.status = this.constStatus;

    propNew.generateNewId();

    // save client info
    const clientNew = new Client();
    clientNew.name = this.name;
    clientNew.email = this.email;
    clientNew.phone = this.phone;

    if (this.currentPage === this.PAGE_SELLER) {
      clientNew.type = Client.CLIENT_TYPE_SELLER;

      // save image
      if (this.uploadPhoto.picture) {
        const path = 'properties/' + propNew.id + '.png';

        this.api.uploadImage(path, this.uploadPhoto.picture)
          .then((url) => {
            propNew.photoUrl = url;

            this.doSaveClient(clientNew, propNew);
          })
          .catch((err) => {
            console.log(err);

            this.showLoadingView(false);
            this.presentAlert(
              'Faild to upload image',
              err.message
            );
          });
      }
    } else {
      clientNew.type = Client.CLIENT_TYPE_BUYER;

      clientNew.priceMin = this.priceMin;
      clientNew.priceMax = this.priceMax;
      clientNew.location = this.location;
      clientNew.propRequest = propNew;

      clientNew.generateNewId();

      if (this.uploadPhoto.picture) {
        const path = 'clients/' + clientNew.id + '.png';

        this.api.uploadImage(path, this.uploadPhoto.picture)
          .then((url) => {
            clientNew.photoUrl = url;

            this.doSaveClient(clientNew);
          })
          .catch((err) => {
            console.log(err);

            this.showLoadingView(false);
            this.presentAlert(
              'Faild to upload image',
              err.message
            );
          });
      } else {
        this.doSaveClient(clientNew);
      }
    }
  }

  async doSaveClient(client, property = null) {
    try {
      await this.api.saveToDatabase(client);

      //
      // save user relation
      //
      const data = [];
      data[client.id] = true;

      let path = `${Client.TABLE_NAME_BUYER_AGENT}/${this.auth.user.id}`;
      if (client.type === Client.CLIENT_TYPE_SELLER) {
        path = `${Client.TABLE_NAME_SELLER_AGENT}/${this.auth.user.id}`;
      }

      await this.api.saveToDatabaseRaw(data, path);

      //
      // save property
      //
      if (client.type === Client.CLIENT_TYPE_SELLER) {
        await this.doSaveProperty(property);
      }

      this.showLoadingView(false);

      // back to prev page
      this.navCtrl.pop();

    } catch (err) {
      console.log(err);

      this.showLoadingView(false);

      this.presentAlert(
        'Faild to save data',
        err.message
      );
    }
  }

  async doSaveProperty(prop) {
    // save data for property
    await this.api.saveToDatabase(prop);
  }
}
