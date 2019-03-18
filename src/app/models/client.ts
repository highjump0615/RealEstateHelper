import {Property} from './property';

export class Client {
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

  constructor() {
  }

  tableName() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER : Client.TABLE_NAME_SELLER;
  }
}
