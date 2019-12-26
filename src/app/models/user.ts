import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {Property} from './property';
import {Client} from './client';
import {Utils} from '../helpers/utils';
import {Purchase} from "./purchase";

export class User extends BaseModel implements Deserializable {

  //
  // table info
  //
  static TABLE_NAME = 'users';
  static FIELD_EMAIL = 'email';
  static FIELD_NAME = 'name';
  static FIELD_PHOTO = 'photoUrl';
  static FIELD_PHONE = 'phone';
  static FIELD_NAME_BKG = 'nameBkg';
  static FIELD_PHONE_BKG = 'phoneBkg';
  static FIELD_ADDR_BKG = 'addressBkg';
  static FIELD_TYPE = 'type';
  static FIELD_TOKEN = 'fcmToken';

  static FIELD_PURCHASE_PRODUCT = 'purchaseProductId';
  static FIELD_PURCHASE_EXPIRE = 'purchaseExpireAt';

  static USER_TYPE_NORMAL = 'normal';
  static USER_TYPE_ADMIN = 'admin';

  //
  // properties
  //

  // agent info
  email = '';
  name = '';
  phone = '';
  photoUrl: string;

  // brokerage info
  nameBkg = '';
  phoneBkg = '';
  addressBkg = '';

  type = User.USER_TYPE_NORMAL;
  fcmToken = '';

  //
  // logical
  //
  saved = true;
  propAll: Array<Property> = [];

  buyers: Array<Client>;
  sellers: Array<Client>;

  lat: number;
  lng: number;

  purchase = new Purchase();

  constructor(withId?: string, snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.email = info[User.FIELD_EMAIL];
      this.name = info[User.FIELD_NAME];
      this.phone = info[User.FIELD_PHONE];

      this.nameBkg = info[User.FIELD_NAME_BKG];
      this.phoneBkg = info[User.FIELD_PHONE_BKG];
      this.addressBkg = info[User.FIELD_ADDR_BKG];

      if (User.FIELD_TYPE in info) {
        this.type = info[User.FIELD_TYPE];
      }
      if (User.FIELD_PHOTO in info) {
        this.photoUrl = info[User.FIELD_PHOTO];
      }
      if (User.FIELD_TOKEN in info) {
        this.fcmToken = info[User.FIELD_TOKEN];
      }

      //
      // purchase
      //
      if (User.FIELD_PURCHASE_PRODUCT in info) {
        this.purchase.productId = info[User.FIELD_PURCHASE_PRODUCT];
      }
      if (User.FIELD_PURCHASE_EXPIRE in info) {
        this.purchase.expireAt = info[User.FIELD_PURCHASE_EXPIRE];
      }
    }

    if (withId) {
      this.id = withId;
    }
  }

  tableName() {
    return User.TABLE_NAME;
  }

  deserialize(input: any): this {
    super.deserialize(input);

    //
    // initialize data
    //
    this.propAll = null;
    this.buyers = null;
    this.sellers = null;

    // purchase data
    this.purchase = new Purchase().deserialize(input.purchase);

    return this;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[User.FIELD_TYPE] = this.type;

    dict[User.FIELD_NAME] = this.name;
    dict[User.FIELD_EMAIL] = this.email;
    dict[User.FIELD_PHONE] = this.phone;
    this.addDictItem(dict, User.FIELD_PHOTO, this.photoUrl);

    dict[User.FIELD_NAME_BKG] = this.nameBkg;
    dict[User.FIELD_PHONE_BKG] = this.phoneBkg;
    dict[User.FIELD_ADDR_BKG] = this.addressBkg;
    dict[User.FIELD_TOKEN] = this.fcmToken;

    // purchase data
    dict[User.FIELD_PURCHASE_PRODUCT] = this.purchase.productId;
    dict[User.FIELD_PURCHASE_EXPIRE] = this.purchase.expireAt;

    return dict;
  }

  getPhone() {
    return Utils.getPhoneStr(this.phone);
  }
  getPhoneBkg() {
    return Utils.getPhoneStr(this.phoneBkg);
  }
}
