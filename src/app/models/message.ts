import {BaseModel} from './base-model';
import {User} from './user';
import DataSnapshot = firebase.database.DataSnapshot;

export class Message extends BaseModel {
  //
  // table info
  //
  static TABLE_NAME = 'messages';
  static TABLE_NAME_CHAT = 'chats';

  static FIELD_SENDER_ID = 'senderId';
  static FIELD_MESSAGE = 'message';

  //
  // properties
  //
  senderId = '';
  message = '';

  //
  // logical
  //
  sender: User;
  toUser: User;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.senderId = info[Message.FIELD_SENDER_ID];
      this.message = info[Message.FIELD_MESSAGE];
    }
  }

  tableName() {
    return Message.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Message.FIELD_SENDER_ID] = this.senderId;
    dict[Message.FIELD_MESSAGE] = this.message;

    return dict;
  }
}
