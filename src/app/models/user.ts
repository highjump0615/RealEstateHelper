
export class User {

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

  constructor() {
  }

  tableName() {
    return User.TABLE_NAME;
  }
}
