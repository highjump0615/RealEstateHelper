import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {GeoFire} from 'geofire';

export class Property extends BaseModel implements Deserializable {

  //
  // table info
  //
  static TABLE_NAME = 'properties';
  static TABLE_NAME_LOCATION = 'propLocations';

  static FIELD_ADDRESS = 'address';
  static FIELD_TITLE = 'title';
  static FIELD_DESC = 'description';

  static FIELD_IMAGES = 'imageUrls';

  // deprecated, imageUrls now
  static FIELD_PHOTO = 'photoUrl';


  static FIELD_PRICE = 'price';
  static FIELD_LOCATION = 'location';

  static FIELD_STYLE = 'style';
  static FIELD_TYPE = 'type';
  static FIELD_SIZE = 'size';
  static FIELD_BEDROOM = 'bedroom';
  static FIELD_BATHROOM = 'bathroom';
  static FIELD_GARAGE = 'garage';
  static FIELD_BASEMENT = 'basement';
  static FIELD_COMMISSION = 'commission';
  static FIELD_LOT_FRONTAGE = 'lotFtg';
  static FIELD_LOT_DEPTH = 'lotDepth';
  static FIELD_STATUS = 'status';
  static FIELD_AGENT = 'agentId';
  static FIELD_SELLERID = 'sellerId';
  static FIELD_SHOW_ADDRESS = 'showAddress';
  static FIELD_DATE_EXPIRED = 'expiredAt';

  static STYLES = [
    'Two-Storey',
    'Bungalow',
    'Sidesplit',
    'Any',
    'Other',
  ];

  static TYPES = [
    'Detached',
    'Semi',
    'Townhouse',
    'Condo Town',
    'Condo Apartment',
    'Other',
  ];

  static GARAGES = [
    'Single',
    '1.5',
    'Double',
    'Carport',
    'None',
    'Attached',
    'Detached',
    'Triple',
    'Other',
  ];

  static STATUSES = [
    'New Constructions',
    'Resale',
    'Assignments'
  ];

  static BASEMENT = [
    'Finished',
    'Unfinished',
    'Partly Finished',
    'Walkout/Walkup',
    'Basement Apt.',
    'Separate Entrance',
    'Other',
  ];

  //
  // properties
  //
  imageUrls = [];

  // deprecated, imageUrls now
  photoUrl: string;

  address = '';
  title = '';
  desc = '';
  price: number;

  location: any;

  style = [];
  type = [];
  size: number;
  bedroom: number;
  bathroom: number;
  garage = [];
  basement = [];
  lotFrontage: number;
  lotDepth: number;

  status = [];

  commission: number;

  agentId = '';
  sellerId = '';

  showAddress = false;

  expiredAt = null;

  //
  // logical
  //
  distance: number;

  static getCodeReadable(idOrigin) {
    if (!idOrigin) {
      return '';
    }

    const strId = idOrigin.substring(idOrigin.length - 10);
    return strId.toUpperCase();
  }

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.fillData(info);
    }
  }

  fillData(info) {
    this.address = info[Property.FIELD_ADDRESS];
    this.title = info[Property.FIELD_TITLE];
    this.desc = info[Property.FIELD_DESC];

    if (Property.FIELD_PRICE in info) {
      this.price = +info[Property.FIELD_PRICE];
    }

    if (Property.FIELD_LOCATION in info) {
      this.location = info[Property.FIELD_LOCATION];
    }

    // photos
    if (Property.FIELD_IMAGES in info) {
      this.imageUrls = info[Property.FIELD_IMAGES];
    }
    else {
      if (Property.FIELD_PHOTO in info) {
        this.imageUrls.push(info[Property.FIELD_PHOTO]);
      }
    }

    if (Property.FIELD_STYLE in info) {
      this.style = info[Property.FIELD_STYLE];
    }
    if (Property.FIELD_TYPE in info) {
      this.type = info[Property.FIELD_TYPE];
    }

    if (Property.FIELD_SIZE in info) {
      this.size = +info[Property.FIELD_SIZE];
    }

    if (Property.FIELD_BEDROOM in info) {
      this.bedroom = +info[Property.FIELD_BEDROOM];
    }
    if (Property.FIELD_BATHROOM in info) {
      this.bathroom = +info[Property.FIELD_BATHROOM];
    }

    if (Property.FIELD_GARAGE in info) {
      this.garage = info[Property.FIELD_GARAGE];
    }
    if (Property.FIELD_BASEMENT in info) {
      this.basement = info[Property.FIELD_BASEMENT];
    }

    if (Property.FIELD_LOT_FRONTAGE in info) {
      this.lotFrontage = +info[Property.FIELD_LOT_FRONTAGE];
    }
    if (Property.FIELD_LOT_DEPTH in info) {
      this.lotDepth = +info[Property.FIELD_LOT_DEPTH];
    }

    if (Property.FIELD_STATUS in info) {
      this.status = info[Property.FIELD_STATUS];
    }

    this.commission = info[Property.FIELD_COMMISSION];

    this.agentId = info[Property.FIELD_AGENT];
    this.sellerId = info[Property.FIELD_SELLERID];

    if (Property.FIELD_SHOW_ADDRESS in info) {
      this.showAddress = info[Property.FIELD_SHOW_ADDRESS];
    }
    if (Property.FIELD_DATE_EXPIRED in info) {
      this.expiredAt = info[Property.FIELD_DATE_EXPIRED];
    }

    return this;
  }

  tableName() {
    return Property.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Property.FIELD_ADDRESS] = this.address;
    dict[Property.FIELD_TITLE] = this.title;
    this.addDictItem(dict, Property.FIELD_DESC, this.desc);
    this.addDictItem(dict, Property.FIELD_PRICE, this.price);
    this.addDictItem(dict, Property.FIELD_LOCATION, this.location);

    this.addDictItem(dict, Property.FIELD_IMAGES, this.imageUrls);

    dict[Property.FIELD_STYLE] = this.style;
    dict[Property.FIELD_TYPE] = this.type;
    this.addDictItem(dict, Property.FIELD_SIZE, this.size);
    this.addDictItem(dict, Property.FIELD_BEDROOM, this.bedroom);
    this.addDictItem(dict, Property.FIELD_BATHROOM, this.bathroom);
    dict[Property.FIELD_GARAGE] = this.garage;
    dict[Property.FIELD_BASEMENT] = this.basement;

    this.addDictItem(dict, Property.FIELD_LOT_FRONTAGE, this.lotFrontage);
    this.addDictItem(dict, Property.FIELD_LOT_DEPTH, this.lotDepth);

    dict[Property.FIELD_STATUS] = this.status;

    this.addDictItem(dict, Property.FIELD_COMMISSION, this.commission);

    dict[Property.FIELD_AGENT] = this.agentId;
    dict[Property.FIELD_SELLERID] = this.sellerId;

    this.addDictItem(dict, Property.FIELD_SHOW_ADDRESS, this.showAddress);
    this.addDictItem(dict, Property.FIELD_DATE_EXPIRED, this.expiredAt);

    return dict;
  }

  distanceToMile() {
    if (this.distance) {
      return (this.distance * 0.621371).toFixed(2);
    }

    return -1;
  }

  getStyleStr() {
    return this.style ? this.style.join(', ') : '';
  }

  getTypeStr() {
    return this.type ? this.type.join(', ') : '';
  }

  getGarageStr() {
    return this.garage ? this.garage.join(', ') : '';
  }

  getBasementStr() {
    return this.basement ? this.basement.join(', ') : '';
  }

  getStatusStr() {
    return this.status ? this.status.join(', ') : '';
  }

  priceStr() {
    return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getIdReadable() {
    return Property.getCodeReadable(this.id);
  }
}
