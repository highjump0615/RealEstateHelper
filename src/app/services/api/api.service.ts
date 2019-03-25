import { Injectable } from '@angular/core';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User} from '../../models/user';

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
}
