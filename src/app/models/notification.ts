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

  static NOTIFICATION_MATCH_BUYER = 'match_buyer';        // new property matched to buyer
  static NOTIFICATION_MATCH_PROPERTY = 'match_property';  // new buyer matched to property
  static NOTIFICATION_EXPIRE_PROPERTY = 'expire_property';
  static NOTIFICATION_EXPIRE_BUYER = 'expire_buyer';
  static NOTIFICATION_REMOVE_PROPERTY = 'remove_property';
  static NOTIFICATION_REMOVE_BUYER = 'remove_buyer';

  static NOTIFICATION_CHAT = 'chat';

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
    return !!(this.client);
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Notification.FIELD_TYPE] = this.type;
    dict[Notification.FIELD_CLIENT_ID] = this.clientId;
    dict[Notification.FIELD_PROPERTY_ID] = this.propertyId;

    return dict;
  }
}
