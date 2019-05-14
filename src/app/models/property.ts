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

  static FIELD_LOT_FRONTAGE = 'lotFtg';
  static FIELD_LOT_DEPTH = 'lotDepth';

  static FIELD_STATUS = 'status';

  static FIELD_AGENT = 'agent';

  static STYLES = [
    'Two-Storey',
    'Bungalow',
    'Sidesplit',
    'Any',
    'Other',
  ];

  static TYPES = [
    'Townhouse',
    'Semi',
    'detached',
    'Condo',
    'Other',
  ];

  static GARAGES = [
    'Single',
    '1.5',
    'Double',
    'Carport',
    'None',
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
    'Rec Room',
    'Basement Apt.',
    'Separate Entrance',
    'No Separate Entrance',
    'Other',
  ];

  //
  // properties
  //
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
  garage = '';
  basement = '';
  lotFrontage: number;
  lotDepth: number;

  status = '';

  agent = '';

  //
  // logical
  //
  distance: number;

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
      this.price = info[Property.FIELD_PRICE];
    }

    if (Property.FIELD_LOCATION in info) {
      this.location = info[Property.FIELD_LOCATION];
    }
    if (Property.FIELD_PHOTO in info) {
      this.photoUrl = info[Property.FIELD_PHOTO];
    }

    this.style = info[Property.FIELD_STYLE];
    this.type = info[Property.FIELD_TYPE];
    this.size = info[Property.FIELD_SIZE];
    this.bedroom = info[Property.FIELD_BEDROOM];
    this.bathroom = info[Property.FIELD_BATHROOM];
    this.garage = info[Property.FIELD_GARAGE];
    this.basement = info[Property.FIELD_BASEMENT];

    this.lotFrontage = info[Property.FIELD_LOT_FRONTAGE];
    this.lotDepth = info[Property.FIELD_LOT_DEPTH];

    this.status = info[Property.FIELD_STATUS];

    this.agent = info[Property.FIELD_AGENT];

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

    this.addDictItem(dict, Property.FIELD_PHOTO, this.photoUrl);

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

    dict[Property.FIELD_AGENT] = this.agent;

    return dict;
  }

  distanceToMile() {
    if (this.distance) {
      return (this.distance * 0.621371).toFixed(2);
    }

    return -1;
  }

  getStyleStr() {
    return this.style.join(', ');
  }

  getTypeStr() {
    return this.type.join(', ');
  }
}
