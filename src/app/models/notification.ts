import {BaseModel} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {Client} from './client';

export class Notification extends BaseModel {
  //
  // table info
  //
  static TABLE_NAME = 'notifications';
  static FIELD_CLIENT_ID = 'clientId';
  static FIELD_PROPERTY_ID = 'propertyId';
  static FIELD_TYPE = 'type';

  static NOTIFICATION_MATCH_BUYER = 0;
  static NOTIFICATION_MATCH_SELLER = 1;
  static NOTIFICATION_TAG = 2;
  static NOTIFICATION_EXPIRE = 3;

  //
  // properties
  //
  type = Notification.NOTIFICATION_MATCH_BUYER;
  clientId = '';
  propertyId = '';

  // logical
  client: Client;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.type = info[Notification.FIELD_TYPE];
      this.clientId = info[Notification.FIELD_CLIENT_ID];
      this.propertyId = info[Notification.FIELD_PROPERTY_ID];
    }
  }

  tableName() {
    return Notification.TABLE_NAME;
  }

  isFetched() {
    if (this.type === Notification.NOTIFICATION_MATCH_BUYER) {
      return !!(this.client);
    }

    return false;
  }
}
