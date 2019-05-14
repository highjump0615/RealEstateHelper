import { Injectable } from '@angular/core';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User} from '../../models/user';
import {Client} from '../../models/client';
import {BaseModel} from '../../models/base-model';
import {Property} from '../../models/property';
import {AuthService} from '../auth/auth.service';

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
          err.name = 'notfound';

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
        if (!snapshot.exists()) {
          const err = new Error('No properties');
          err.name = 'notfound';

          return Promise.reject(err);
        }

        snapshot.forEach(function(child) {
          const p = new Property(child);

          properties.push(p);
        });

        return Promise.resolve(properties);
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

  saveToDatabaseRaw(data, path) {
    const db = FirebaseManager.ref().child(path);
    return db.set(data);
  }

  uploadImage(path, imgData) {
    return FirebaseManager.getInstance().uploadImageTo(path, imgData);
  }
}
