import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {Property} from './property';

export class Client extends BaseModel implements Deserializable {
  //
  // table info
  //
  static TABLE_NAME_BUYER = 'buyers';
  static TABLE_NAME_SELLER = 'sellers';

  static FIELD_EMAIL = 'email';
  static FIELD_NAME = 'name';
  static FIELD_PHOTO = 'photoUrl';
  static FIELD_PHONE = 'phone';

  // for buyers
  static FIELD_BUDGET_MIN = 'budgetMin';
  static FIELD_BUDGET_MAX = 'budgetMax';
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

  budgetMin: number;
  budgetMax: number;

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
      if (Client.FIELD_BUDGET_MIN in info) {
        this.budgetMin = info[Client.FIELD_BUDGET_MIN];
      }
      if (Client.FIELD_BUDGET_MAX in info) {
        this.budgetMax = info[Client.FIELD_BUDGET_MAX];
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

    return dict;
  }
}
