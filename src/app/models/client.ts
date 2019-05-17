import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {Property} from './property';

export class Client extends BaseModel implements Deserializable {
  //
  // table info
  //
  static TABLE_NAME_BUYER = 'buyers';
  static TABLE_NAME_SELLER = 'sellers';
  static TABLE_NAME_BUYER_AGENT = 'buyersAgent';
  static TABLE_NAME_SELLER_AGENT = 'sellersAgent';

  static FIELD_EMAIL = 'email';
  static FIELD_NAME = 'name';
  static FIELD_PHOTO = 'photoUrl';
  static FIELD_PHONE = 'phone';
  static FIELD_ADDRESS = 'address';

  // for buyers
  static FIELD_PRICE_MIN = 'priceMin';
  static FIELD_PRICE_MAX = 'priceMax';

  static FIELD_SIZE_MIN = 'sizeMin';
  static FIELD_SIZE_MAX = 'sizeMax';

  static FIELD_RADIUS = 'radius';

  static FIELD_PROP_REQ = 'propertyRequest';
  static FIELD_DESC = 'description';

  // note
  static FIELD_NOTE = 'note';

  // sellers
  static FIELD_PROPERTY = 'property';

  static FIELD_AGENTID = 'agentId';

  static CLIENT_TYPE_BUYER = 0;
  static CLIENT_TYPE_SELLER = 1;

  //
  // properties
  //
  email = '';
  name = '';
  phone = '';
  photoUrl: string;

  priceMin: number;
  priceMax: number;

  sizeMin: number;
  sizeMax: number;

  radius: number;

  address = '';
  desc = '';

  property: string;

  propRequest: Property;

  note = '';

  agentId = '';

  //
  // logical
  //
  type = Client.CLIENT_TYPE_BUYER;

  selected = false;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.email = info[Client.FIELD_EMAIL];
      this.name = info[Client.FIELD_NAME];
      this.phone = info[Client.FIELD_PHONE];

      if (Client.FIELD_PHOTO in info) {
        this.photoUrl = info[Client.FIELD_PHOTO];
      }

      this.agentId = info[Client.FIELD_AGENTID];

      // buyer
      if (Client.FIELD_PRICE_MIN in info) {
        this.priceMin = info[Client.FIELD_PRICE_MIN];
      }
      if (Client.FIELD_PRICE_MAX in info) {
        this.priceMax = info[Client.FIELD_PRICE_MAX];
      }

      if (Client.FIELD_SIZE_MIN in info) {
        this.sizeMin = info[Client.FIELD_SIZE_MIN];
      }
      if (Client.FIELD_SIZE_MAX in info) {
        this.sizeMax = info[Client.FIELD_SIZE_MAX];
      }

      this.radius = info[Client.FIELD_RADIUS];

      this.desc = info[Client.FIELD_DESC];

      if (Client.FIELD_ADDRESS in info) {
        this.address = info[Client.FIELD_ADDRESS];
      }

      if (Client.FIELD_PROP_REQ in info) {
        this.propRequest = new Property().fillData(info[Client.FIELD_PROP_REQ]);
      }

      // seller
      if (Client.FIELD_PROPERTY in info) {
        this.property = info[Client.FIELD_PROPERTY];
      }
    }
  }

  tableName() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER : Client.TABLE_NAME_SELLER;
  }
  tableNameAgent() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER_AGENT : Client.TABLE_NAME_SELLER_AGENT;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Client.FIELD_NAME] = this.name;
    dict[Client.FIELD_EMAIL] = this.email;
    dict[Client.FIELD_PHONE] = this.phone;
    this.addDictItem(dict, Client.FIELD_PHOTO, this.photoUrl);

    // location & address
    this.addDictItem(dict, Client.FIELD_ADDRESS, this.address);

    dict[Client.FIELD_AGENTID] = this.agentId;

    //
    // buyer
    //

    // price
    this.addDictItem(dict, Client.FIELD_PRICE_MIN, this.priceMin);
    this.addDictItem(dict, Client.FIELD_PRICE_MAX, this.priceMax);

    // price
    this.addDictItem(dict, Client.FIELD_SIZE_MIN, this.sizeMin);
    this.addDictItem(dict, Client.FIELD_SIZE_MAX, this.sizeMax);

    if (this.propRequest) {
      dict[Client.FIELD_PROP_REQ] = this.propRequest.toDictionary();
    }
    this.addDictItem(dict, Client.FIELD_DESC, this.desc);

    this.addDictItem(dict, Client.FIELD_RADIUS, this.radius);

    //
    // seller
    //
    this.addDictItem(dict, Client.FIELD_PROPERTY, this.property);

    return dict;
  }
}
