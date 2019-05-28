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

  price: number;

  isAddressVisible = false;

  title = '';

  size: number;

  description = '';
  descProp = '';

  radius = 10;

  constructor(
    public navCtrl: NavController,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
    private auth: AuthService,
    public api: ApiService
  ) {
    super(loadingCtrl, alertCtrl, propService);
  }

  ngOnInit() {
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

      if (!this.propService.address) {
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

      // size
      if (!this.size) {
        this.presentAlert(
          'Invalid Size',
          'Please input house size'
        );
        return;
      }
    } else {
      // buyer

      // price range
      if (!this.priceMin || !this.priceMax) {
        this.presentAlert(
          'Invalid Price',
          'Please enter price'
        );
        return;
      }

      // size range
      if (!this.sizeMin) {
        this.presentAlert(
          'Invalid Size',
          'Please enter house size'
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

    if (this.garages.length <= 0) {
      this.presentAlert(
        'Invalid Garage',
        'Please select garage info'
      );
      return;
    }

    if (this.basements.length <= 0) {
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

    if (this.constStatus.length <= 0) {
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
    propNew.address = this.propService.address;
    propNew.title = this.title;
    propNew.desc = this.descProp;
    propNew.style = this.styles;
    propNew.type = this.types;
    propNew.size = this.size;
    propNew.bedroom = this.bedroom;
    propNew.bathroom = this.bathroom;
    propNew.garage = this.garages;
    propNew.basement = this.basements;
    propNew.lotFrontage = this.frontage;
    propNew.lotDepth = this.depth;
    propNew.status = this.constStatus;
    propNew.price = this.price;

    // save location
    if (this.propService.lat && this.propService.lng) {
      propNew.location = [this.propService.lat, this.propService.lng];
    }

    propNew.generateNewId();

    // save client info
    const clientNew = new Client();
    clientNew.name = this.name;
    clientNew.email = this.email;
    clientNew.phone = this.phone;
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
      // add to user client list
      //
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
