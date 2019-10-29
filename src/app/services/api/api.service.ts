import { Injectable } from '@angular/core';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User} from '../../models/user';
import {Client} from '../../models/client';
import {BaseModel} from '../../models/base-model';
import {Property} from '../../models/property';
import {AuthService} from '../auth/auth.service';
import {Message} from '../../models/message';
import {Favourite} from '../../models/favourite';
import {Notification} from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private auth: AuthService
  ) { }

  checkUserExistingByEmail(email) {
    // fetch products
    const dbRef = FirebaseManager.ref();

    const query: any = dbRef.child(User.TABLE_NAME)
      .orderByChild(User.FIELD_EMAIL)
      .equalTo(email);

    return query.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      });
  }

  /**
   * fetch user with id
   * @param id
   */
  getUserWithId(id): Promise<User> {
    const userRef = FirebaseManager.ref()
      .child(User.TABLE_NAME)
      .child(id);

    return userRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          const err = new Error('User not found');
          err.name = 'not-found';

          return Promise.reject(err);
        }

        const user = new User(null, snapshot);
        return Promise.resolve(user);
      });
  }

  fetchClientWithId(id, isBuyer): Promise<Client> {
    const dbRef = FirebaseManager.ref()
      .child(isBuyer ? Client.TABLE_NAME_BUYER : Client.TABLE_NAME_SELLER)
      .child(id);

    return dbRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          const err = new Error('Client not found');
          err.name = 'notfound';

          return Promise.reject(err);
        }

        const client = new Client(snapshot);
        client.type = isBuyer ? Client.CLIENT_TYPE_BUYER : Client.CLIENT_TYPE_SELLER;

        return Promise.resolve(client);
      });
  }

  /**
   * fetch client note of the user
   * @param client
   */
  fetchClientNote(client): Promise<string> {
    const dbRef = FirebaseManager.ref();
    const query = dbRef
      .child(client.tableNameAgent())
      .child(this.auth.user.id)
      .child(client.id);

    return query.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          const err = new Error('Note not found');
          err.name = 'notfound';

          return Promise.reject(err);
        }

        let strNote = '';
        const info = snapshot.val();
        strNote = info[Client.FIELD_NOTE];

        return Promise.resolve(strNote);
      });
  }

  saveClientNote(client) {
    const dbRef = FirebaseManager.ref();
    const query = dbRef
      .child(client.tableNameAgent())
      .child(this.auth.user.id)
      .child(client.id);

    const data = [];
    data[Client.FIELD_NOTE] = client.note;

    return query.set(data);
  }

  fetchPropertyWithId(id): Promise<Property> {
    const dbRef = FirebaseManager.ref()
      .child(Property.TABLE_NAME)
      .child(id);

    return dbRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          const err = new Error('Property not found');
          err.name = 'notfound';

          return Promise.reject(err);
        }

        const p = new Property(snapshot);
        return Promise.resolve(p);
      });
  }

  getAllProperties(): Promise<Array<Property>> {
    const properties = [];

    const dbRef = FirebaseManager.ref().child(Property.TABLE_NAME);

    return dbRef.once('value')
      .then((snapshot) => {
        snapshot.forEach(function(child) {
          const p = new Property(child);

          properties.push(p);
        });

        return Promise.resolve(properties);
      });
  }

  getAllBuyers(): Promise<Array<Client>> {
    const clients = [];

    const dbRef = FirebaseManager.ref().child(Client.TABLE_NAME_BUYER);

    return dbRef.once('value')
      .then((snapshot) => {
        snapshot.forEach(function(child) {
          const c = new Client(child);

          clients.push(c);
        });

        return Promise.resolve(clients);
      });
  }

  /**
   * get cart products of the user
   */
  fetchClients(isBuyer) {
    const that = this;

    // fetch products
    const dbRef = FirebaseManager.ref();

    const query: any = dbRef
      .child(isBuyer ? Client.TABLE_NAME_BUYER_AGENT : Client.TABLE_NAME_SELLER_AGENT)
      .child(this.auth.user.id);

    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        // clear data
        const proms = [];

        snapshot.forEach(function(child) {
          // get client data
          const data = that.fetchClientWithId(child.key, isBuyer);
          proms.push(data);
        });

        return Promise.all(proms);
      });
  }

  deleteClient(client: Client) {
    // fetch products
    const dbRef = FirebaseManager.ref();

    // remove property if it is seller
    if (client.type === Client.CLIENT_TYPE_SELLER && client.propertyId) {
      const queryProp = dbRef
        .child(Property.TABLE_NAME)
        .child(client.propertyId);

      queryProp.remove();
    }

    const queryClient = dbRef
      .child(client.type === Client.CLIENT_TYPE_BUYER ?
        Client.TABLE_NAME_BUYER_AGENT :
        Client.TABLE_NAME_SELLER_AGENT)
      .child(this.auth.user.id)
      .child(client.id);

    queryClient.remove();
  }

  /**
   * Fetch added message
   * @param userFrom
   * @param userTo
   * @param onAdded
   */
  fetchMessageAdded(userFrom, userTo, onAdded: (msg) => void) {
    const messages = [];

    // fetch products
    const dbRef = FirebaseManager.ref();

    const query = dbRef.child(Message.TABLE_NAME)
      .child(userFrom)
      .child(userTo);

    return query.on('child_added', (snapshot) => {
      const msg = new Message(snapshot);

      onAdded(msg);
    });
  }

  fetchChatList() {
    const messages = [];

    // fetch products
    const dbRef = FirebaseManager.ref();

    const query = dbRef.child(Message.TABLE_NAME_CHAT)
      .child(this.auth.user.id);

    return query.once('value')
      .then((snapshot) => {
        snapshot.forEach(function(child) {
          const m = new Message(child);

          messages.push(m);
        });

        return messages;
      });
  }

  deleteChat(userId) {
    const dbRef = FirebaseManager.ref();

    // remove chat
    let query = dbRef.child(Message.TABLE_NAME_CHAT)
      .child(this.auth.user.id)
      .child(userId);
    query.remove();

    // remove messages
    query = dbRef.child(Message.TABLE_NAME)
      .child(this.auth.user.id)
      .child(userId);
    query.remove();
  }

  async fetchFavouriteBuyers(): Promise<Array<Client>> {
    const that = this;

    const dbRef = FirebaseManager.ref();

    try {
      let query;
      let snapshot;

      const buyerIds = [];
      if (this.auth.user.buyers) {
        for (const buyer of this.auth.user.buyers) {
          buyerIds.push(buyer.id);
        }
      } else {
        // fetch buyer ids of the user
        query = dbRef
          .child(Client.TABLE_NAME_BUYER_AGENT)
          .child(this.auth.user.id);

        snapshot = await query.once('value');

        snapshot.forEach(function(child) {
          buyerIds.push(child.key);
        });
      }

      // promise array
      const proms = [];

      for (const bId of buyerIds) {
        // check if the buyer has favourite properties
        query = dbRef
          .child(Favourite.TN_FAVOURITE_BUYER)
          .child(bId);

        snapshot = await query.once('value');
        if (!snapshot.exists()) {
          continue;
        }

        const data = that.fetchClientWithId(bId, true);
        proms.push(data);
      }

      return Promise.all(proms);

    } catch (err) {
      console.log(err);
    }
  }

  async fetchFavouriteBuyersOfProperty(propertyId) {
    const dbRef = FirebaseManager.ref();

    const buyerIds = [];

    // fetch buyer ids of the user
    const query = dbRef
      .child(Favourite.TN_FAVOURITE_PROPERTY)
      .child(propertyId);

    const snapshot = await query.once('value');
    if (!snapshot.exists()) {
      return buyerIds;
    }

    snapshot.forEach(function(child) {
      buyerIds.push(child.key);
    });

    return buyerIds;
  }

  async fetchFavouriteSellers(): Promise<Array<Client>> {
    const that = this;

    const dbRef = FirebaseManager.ref();

    try {
      let query;
      let snapshot;

      const sellerIds = [];
      if (this.auth.user.sellers) {
        for (const buyer of this.auth.user.sellers) {
          sellerIds.push(buyer.id);
        }
      } else {
        // fetch buyer ids of the user
        query = dbRef
          .child(Client.TABLE_NAME_SELLER_AGENT)
          .child(this.auth.user.id);

        snapshot = await query.once('value');

        snapshot.forEach(function(child) {
          sellerIds.push(child.key);
        });
      }

      // promise array
      const proms = [];

      for (const sId of sellerIds) {
        // check if the seller has favourite properties

        query = dbRef
          .child(Favourite.TN_FAVOURITE_SELLER)
          .child(sId);

        snapshot = await query.once('value');
        if (!snapshot.exists()) {
          continue;
        }

        const data = that.fetchClientWithId(sId, false);
        proms.push(data);
      }

      return Promise.all(proms);

    } catch (err) {
      console.log(err);
    }
  }

  async getFavouritePropertiesOfBuyer(buyerId): Promise<Array<Property>> {
    const dbRef = FirebaseManager.ref();

    //
    // fetch property ids
    //
    const query = dbRef.child(Favourite.TN_FAVOURITE_BUYER)
      .child(buyerId);

    const propIds = [];
    const snapshot = await query.once('value');
    snapshot.forEach(function(child) {
      propIds.push(child.key);
    });

    // promise array
    const proms = [];

    for (const pId of propIds) {
      // check if the seller has favourite properties
      const data = this.fetchPropertyWithId(pId);
      proms.push(data);
    }

    return Promise.all(proms);
  }

  async getFavouriteBuyersOfSeller(sellerId): Promise<Array<Client>> {
    const dbRef = FirebaseManager.ref();

    //
    // fetch buyer ids
    //
    const query = dbRef.child(Favourite.TN_FAVOURITE_SELLER)
      .child(sellerId);

    const buyerIds = [];
    const snapshot = await query.once('value');
    snapshot.forEach(function(child) {
      buyerIds.push(child.key);
    });

    // promise array
    const proms = [];

    for (const bId of buyerIds) {
      // check if the seller has favourite properties
      const data = this.fetchClientWithId(bId, true);
      proms.push(data);
    }

    return Promise.all(proms);
  }

  getAllNotifications() {
    const notifications = [];

    const dbRef = FirebaseManager.ref()
      .child(Notification.TABLE_NAME)
      .child(this.auth.user.id);

    return dbRef.once('value')
      .then((snapshot) => {
        snapshot.forEach(function(child) {
          const n = new Notification(child);

          notifications.push(n);
        });

        return Promise.resolve(notifications);
      });
  }

  sendFeedback(text) {
    const send = FirebaseManager.getInstance().getCloudFunction('sendMail');

    return send({
      text: text
    });
  }

  sendShareProperty(to, propId) {
    const share = FirebaseManager.getInstance().getCloudFunction('shareProperty');

    return share({
      sendTo: to,
      name: this.auth.user.name,
      data: {propertyId: propId},
    });
  }

  sendChatNotification(userIdTo, msg) {
    const func = FirebaseManager.getInstance().getCloudFunction('sendFcm');

    return func({
      userId: userIdTo,
      msg: msg,
    });
  }

  /**
   * save entire object to database
   *
   * @param data
   * @param withID
   * @param parentID
   */
  saveToDatabase(data: BaseModel, withID?: string, parentID?: string) {
    const db = data.getDatabaseRef(withID, parentID);
    return db.set(data.toDictionary());
  }

  saveToDatabaseWithField(
    data: BaseModel,
    field: string,
    value: any,
    withID?: string,
    parentID?: string
  ) {
    const db = data.getDatabaseRef(withID, parentID);
    db.child(field).set(value);
  }

  saveToDatabaseRaw(data, path) {
    const db = FirebaseManager.ref().child(path);
    return db.set(data);
  }

  uploadImage(path, imgData) {
    return FirebaseManager.getInstance().uploadImageTo(path, imgData);
  }
}
