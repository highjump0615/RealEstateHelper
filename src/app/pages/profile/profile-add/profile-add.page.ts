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
import {PropertyService} from '../../../services/property/property.service';
import {GeoFire} from 'geofire';
import {BaseClientAddPage} from '../../base-client-add.page';
import {NavService} from '../../../services/nav.service';
import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';

@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.page.html',
  styleUrls: ['./profile-add.page.scss'],
})
export class ProfileAddPage extends BaseClientAddPage implements OnInit {

  @ViewChild('imagePhoto') uploadPhoto: ImageUploaderComponent;
  @ViewChild('mainForm') formMain: NgForm;

  // input data
  name = '';
  email = '';
  phone = '';
  commission: number;

  price: number;

  isAddressVisible = false;

  title = '';

  description = '';
  descProp = '';

  radius = 10;

  client: Client;

  maskNumber: any;
  maskPhone = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    public navCtrl: NavController,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public nav: NavService,
    public propService: PropertyService,
    private auth: AuthService,
    public api: ApiService
  ) {
    super(loadingCtrl, alertCtrl, propService);

    // get parameter
    this.client = this.nav.get('data');

    // text mask
    this.maskNumber = createNumberMask({
      prefix: '$',
      thousandsSeparatorSymbol: ',',
      allowDecimal: true,
      decimalSymbol: '.'
    });
  }

  async ngOnInit() {
    // init data
    if (this.client) {
      this.currentPage = this.client.type;

      this.name = this.client.name;
      this.email = this.client.email;
      this.phone = this.client.phone;

      this.priceMin = this.client.priceMin;
      this.priceMax = this.client.priceMax;

      this.sizeMin = this.client.sizeMin;
      this.sizeMax = this.client.sizeMax;

      this.description = this.client.desc;

      if (this.client.propRequest) {
        this.styles = this.client.propRequest.style;
        this.types = this.client.propRequest.type;

        this.bedroom = this.client.propRequest.bedroom;
        this.bathroom = this.client.propRequest.bathroom;

        this.frontage = this.client.propRequest.lotFrontage;
        this.depth = this.client.propRequest.lotDepth;

        this.basements = this.client.propRequest.basement;
        this.constStatus = this.client.propRequest.status;

        this.garages = this.client.propRequest.garage;

        if (this.client.propRequest.location) {
          this.propService.lat = this.client.propRequest.location[0];
          this.propService.lng = this.client.propRequest.location[1];
        }
        this.propService.address = this.client.propRequest.address

        this.radius = this.client.radius;

      } else {
        this.price = this.client.property.price;
        this.commission = this.client.property.commission;
        this.title = this.client.property.title;
        this.sizeMin = this.client.property.size;
        this.descProp = this.client.property.desc;

        this.styles = this.client.property.style;
        this.types = this.client.property.type;

        this.bedroom = this.client.property.bedroom;
        this.bathroom = this.client.property.bathroom;

        this.frontage = this.client.property.lotFrontage;
        this.depth = this.client.property.lotDepth;

        this.basements = this.client.property.basement;
        this.constStatus = this.client.property.status;

        this.garages = this.client.property.garage;

        if (this.client.property.location) {
          this.propService.lat = this.client.property.location[0];
          this.propService.lng = this.client.property.location[1];
        }
        this.propService.address = this.client.property.address;
      }
    }
  }

  getPhotoUrl() {
    let url = null;

    if (this.client) {
      if (this.client.type === Client.CLIENT_TYPE_BUYER) {
        url = this.client.photoUrl;
      } else {
        url = this.client.property.photoUrl;
      }
    }

    return url;
  }

  onAddressChecked(event) {
    if (this.isAddressVisible) {
      this.presentAddressVisibleConfirm();
    }
  }

  async presentAddressVisibleConfirm() {
    const alert = await this.alertCtrl.create({
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

  unmask(val) {
    return val.replace(/\D+/g, '');
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
        // except for edit case
        if (!this.client ||
          !this.client.property ||
          (this.client && this.client.property && !this.client.property.photoUrl)) {

          this.presentAlert(
            'Image Not Selected',
            'Property Photo is needed to post seller data,'
          );

          return;
        }
      }

      if (!this.price) {
        this.presentAlert(
          'Invalid Price',
          'Please enter price'
        );
        return;
      }
    }

    this.formMain.ngSubmit.emit();
  }

  onPageChanged(page: number) {
    // cannot change tab in edit
    if (this.client) {
      return;
    }

    super.onPageChanged(page);
  }

  onSubmit() {
    console.log('submitting ...');

    this.showLoadingView();

    const user = this.auth.user;

    //
    // save data for client
    //

    // save property info
    let propNew = new Property();
    if (this.client && this.client.property) {
      propNew = this.client.property;
    }
    propNew.address = this.propService.address;
    propNew.title = this.title;
    propNew.desc = this.descProp;
    propNew.style = this.styles;
    propNew.type = this.types;
    propNew.size = this.sizeMin;
    propNew.bedroom = this.bedroom;
    propNew.bathroom = this.bathroom;
    propNew.garage = this.garages;
    propNew.basement = this.basements;
    propNew.lotFrontage = this.frontage;
    propNew.lotDepth = this.depth;
    propNew.status = this.constStatus;
    propNew.price = this.unmask(this.price);
    propNew.commission = this.commission;
    propNew.agentId = this.auth.user.id;

    // save location
    if (this.propService.lat && this.propService.lng) {
      propNew.location = [this.propService.lat, this.propService.lng];
    }

    propNew.generateNewId();

    // save client info
    let clientNew = new Client();
    if (this.client) {
      clientNew = this.client;
    }

    clientNew.name = this.name;
    clientNew.email = this.email;
    clientNew.phone = this.unmask(this.phone);
    clientNew.desc = this.description;
    clientNew.agentId = this.auth.user.id;

    if (this.currentPage === this.PAGE_SELLER) {
      clientNew.type = Client.CLIENT_TYPE_SELLER;
      clientNew.property = propNew;

      // add property
      clientNew.propertyId = propNew.id;

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
      } else {
        this.doSaveClient(clientNew, propNew);
      }
    } else {
      clientNew.type = Client.CLIENT_TYPE_BUYER;

      clientNew.priceMin = this.priceMin;
      clientNew.priceMax = this.priceMax;

      clientNew.sizeMin = this.sizeMin;
      clientNew.sizeMax = this.sizeMax;

      clientNew.address = this.propService.address;
      clientNew.radius = this.radius;
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
      let path = `${Client.TABLE_NAME_BUYER_AGENT}`;
      if (client.type === Client.CLIENT_TYPE_SELLER) {
        path = `${Client.TABLE_NAME_SELLER_AGENT}`;
      }

      await this.api.saveToDatabaseRaw(true,
        `${path}/${this.auth.user.id}/${client.id}`);

      //
      // save property
      //
      if (client.type === Client.CLIENT_TYPE_SELLER) {
        property.sellerId = client.id;

        await this.doSaveProperty(property);
      }

      //
      // add to user client list, for add new clien only
      //
      if (!this.client) {
        if (client.type === Client.CLIENT_TYPE_SELLER) {
          // add to array if initialized only
          if (this.auth.user.sellers) {
            this.auth.user.sellers.push(client);
          }
        } else {
          // add to array if initialized only
          if (this.auth.user.buyers) {
            this.auth.user.buyers.push(client);
          }
        }
      }

      this.showLoadingView(false);

      // back to prev page
      this.navCtrl.pop();

    } catch (err) {
      console.log(err);

      this.showLoadingView(false);

      this.presentAlert(
        'Failed to save data',
        err.message
      );
    }
  }

  async doSaveProperty(prop) {
    // save to geofire
    if (this.propService.lat && this.propService.lng) {
      const dbRef = FirebaseManager.ref().child(Property.TABLE_NAME_LOCATION);
      const geoFire = new GeoFire(dbRef);
      geoFire.set(prop.id, [this.propService.lat, this.propService.lng]);
    }

    // save data for property
    await this.api.saveToDatabase(prop);

    // add to user property list
    this.auth.user.propAll.push(prop);
  }


}
