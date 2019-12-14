import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  PickerController
} from '@ionic/angular';
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
import {Utils} from '../../../helpers/utils';
import {Camera} from '@ionic-native/camera/ngx';
import {ImageHelper} from '../../../helpers/image-helper';


@Component({
  selector: 'app-profile-add',
  templateUrl: './profile-add.page.html',
  styleUrls: ['./profile-add.page.scss'],
})
export class ProfileAddPage extends BaseClientAddPage implements OnInit {

  @ViewChild('mainForm') formMain: NgForm;

  images = [];

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
  addressOld = '';

  maskPhone = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    public navCtrl: NavController,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public nav: NavService,
    public propService: PropertyService,
    private auth: AuthService,
    public api: ApiService,
    public pickerCtrl: PickerController,
  ) {
    super(loadingCtrl, alertCtrl, propService, pickerCtrl);

    // get parameter
    this.client = this.nav.get('data');
  }

  toString(val) {
    if (!val) {
      return '';
    }

    return val.toString();
  }

  async ngOnInit() {
    // init data
    if (this.client) {
      this.currentPage = this.client.type;

      this.name = this.client.name;
      this.email = this.client.email;
      this.phone = this.client.phone;

      this.priceMin = this.toString(this.client.priceMin);
      this.priceMax = this.toString(this.client.priceMax);

      this.sizeMin = this.toString(this.client.sizeMin);
      this.sizeMax = this.toString(this.client.sizeMax);

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

        // address
        this.addressOld = this.client.propRequest.address;
        this.propService.address = this.client.propRequest.address;

        this.radius = this.client.radius;

      } else {
        this.price = this.client.property.price;
        this.commission = this.client.property.commission;
        this.title = this.client.property.title;
        this.sizeMin = this.toString(this.client.property.size);
        this.descProp = this.client.property.desc;

        this.isAddressVisible = this.client.property.showAddress;

        this.styles = this.client.property.style;
        this.types = this.client.property.type;

        this.bedroom = this.client.property.bedroom;
        this.bathroom = this.client.property.bathroom;

        this.frontage = this.client.property.lotFrontage;
        this.depth = this.client.property.lotDepth;

        this.basements = this.client.property.basement;
        this.constStatus = this.client.property.status;

        this.garages = this.client.property.garage;

        this.images = [...this.client.property.imageUrls];

        if (this.client.property.location) {
          this.propService.lat = this.client.property.location[0];
          this.propService.lng = this.client.property.location[1];
        }

        // address
        this.addressOld = this.client.property.address;
        this.propService.address = this.client.property.address;
      }
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');

    // address is selected newly
    const addressNew = this.propService.address;
    if (!this.addressOld && addressNew) {
      this.addressOld = addressNew;

      // show popup
      this.presentAddressVisibleConfirm();
    }
  }

  async presentAddressVisibleConfirm() {
    const alert = await this.alertCtrl.create({
      message: `Property address will not be displayed to other users unless selecting the “Make property address visible” box below.`,
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

    if (this.currentPage === this.PAGE_SELLER) {
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

  savePropertyImages() {

  }

  async onSubmit() {
    console.log('submitting ...');

    await this.showLoadingView();

    const user = this.auth.user;

    //
    // save data for client
    //

    try {
      //
      // save property info
      //
      let propNew = new Property();
      if (this.client && this.client.property) {
        propNew = this.client.property;
        propNew.updateTime();
      }
      propNew.address = this.propService.address;
      propNew.title = this.title;
      propNew.desc = this.descProp;
      propNew.style = this.styles;
      propNew.type = this.types;
      propNew.size = this.unmask(this.sizeMin);
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
      propNew.showAddress = this.isAddressVisible;

      // save location
      if (this.propService.lat && this.propService.lng) {
        propNew.location = [this.propService.lat, this.propService.lng];
      }

      propNew.generateNewId();

      //
      // save client info
      //
      let clientNew = new Client();
      if (this.client) {
        clientNew = this.client;
        clientNew.updateTime();
      }
      else {
        clientNew.generateNewId();
      }

      clientNew.name = this.name;
      clientNew.email = this.email;
      clientNew.phone = this.unmask(this.phone);
      clientNew.desc = this.description;
      clientNew.agentId = this.auth.user.id;

      if (this.currentPage === this.PAGE_SELLER) {
        clientNew.type = Client.CLIENT_TYPE_SELLER;

        //
        // upload property images
        //
        const imageUrlsProp = [];

        for (const img of this.images) {
          // skip already uploaded
          if (Utils.validURL(img)) {
            imageUrlsProp.push(img);

            continue;
          }

          const path = `products/${propNew.id}/${Utils.makeId(5)}`;
          const urlImg = await this.api.uploadImage(path, img);

          console.log('uploaded iamge: ', urlImg);

          imageUrlsProp.push(urlImg);
        }

        propNew.imageUrls = imageUrlsProp;
        clientNew.property = propNew;

        // add property
        clientNew.propertyId = propNew.id;

      } else {
        clientNew.type = Client.CLIENT_TYPE_BUYER;

        clientNew.priceMin = this.unmask(this.priceMin);
        clientNew.priceMax = this.unmask(this.priceMax);

        clientNew.sizeMin = this.unmask(this.sizeMin);
        clientNew.sizeMax = this.unmask(this.sizeMax);

        clientNew.address = this.propService.address;
        clientNew.radius = this.radius;
        clientNew.propRequest = propNew;
      }

      this.doSaveClient(clientNew, propNew);

      // back to prev page
      this.navCtrl.pop();

    } catch (err) {
      console.log(err);

      this.presentAlert(
          'Faild to save data',
          err.message
      );
    }

    this.showLoadingView(false);
  }

  async doSaveClient(client, property) {
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
    // add to user client list, for add new client only
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

  //
  // images
  //
  getArrayPhotos() {
    const len = Math.min(this.images.length + 1, 10);

    return Array(len).fill(1);
  }

  onImageSelected(index, data) {
    // image array
    const imgs = [...this.images, ...data];

    // allow 10 images maximum
    if (imgs.length > 10) {
      imgs.length = 10;
    }

    this.images = imgs;
  }

  onImageRemoved(index) {
    this.images.splice(index, 1);
  }
}
