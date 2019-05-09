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

  // for buyers
  static FIELD_PRICE_MIN = 'priceMin';
  static FIELD_PRICE_MAX = 'priceMax';
  static FIELD_PROP_REQ = 'propertyRequest';

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
  location = '';

  propRequest: Property;

  type = Client.CLIENT_TYPE_BUYER;

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

      // buyer
      if (Client.FIELD_PRICE_MIN in info) {
        this.priceMin = info[Client.FIELD_PRICE_MIN];
      }
      if (Client.FIELD_PRICE_MAX in info) {
        this.priceMax = info[Client.FIELD_PRICE_MAX];
      }
    }
  }

  tableName() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER : Client.TABLE_NAME_SELLER;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Client.FIELD_NAME] = this.name;
    dict[Client.FIELD_EMAIL] = this.email;
    dict[Client.FIELD_PHONE] = this.phone;
    this.addDictItem(dict, Client.FIELD_PHOTO, this.photoUrl);

    // price
    this.addDictItem(dict, Client.FIELD_PRICE_MIN, this.priceMin);
    this.addDictItem(dict, Client.FIELD_PRICE_MAX, this.priceMax);

    if (this.propRequest) {
      dict[Client.FIELD_PROP_REQ] = this.propRequest.toDictionary();
    }

    return dict;
  }
}
