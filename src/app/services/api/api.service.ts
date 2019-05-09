import { Injectable } from '@angular/core';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User} from '../../models/user';
import {Client} from '../../models/client';
import {BaseModel} from '../../models/base-model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

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
