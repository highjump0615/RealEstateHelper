import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;

export class User extends BaseModel implements Deserializable {

  //
  // table info
  //
  static TABLE_NAME = 'users';
  static FIELD_EMAIL = 'email';
  static FIELD_TYPE = 'type';
  static FIELD_PHOTO = 'photoUrl';

  static USER_TYPE_NORMAL = 'normal';
  static USER_TYPE_ADMIN = 'admin';

  //
  // properties
  //
  email = '';
  photoUrl: string;

  type = User.USER_TYPE_NORMAL;

  constructor(withId?: string, snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.email = info[User.FIELD_EMAIL];

      if (User.FIELD_TYPE in info) {
        this.type = info[User.FIELD_TYPE];
      }
      if (User.FIELD_PHOTO in info) {
        this.photoUrl = info[User.FIELD_PHOTO];
      }
    }

    if (withId) {
      this.id = withId;
    }
  }
}