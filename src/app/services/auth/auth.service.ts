import { Injectable } from '@angular/core';
import {User} from '../../models/user';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User as FUser} from 'firebase';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static KEY_USER = 'current_user';

  user: User;

  constructor(
    private storage: Storage
  ) { }

  signUp(email: string, password: string): Promise<FUser> {
    // do signup
    return FirebaseManager.auth().createUserWithEmailAndPassword(
      email,
      password
    ).then((res) => {
      console.log(res);

      if (!res.user) {
        return Promise.reject(new Error('User not created'));
      }

      return Promise.resolve(res.user);
    });
  }

  signIn(email: string, password: string): Promise<FUser> {
    // do login
    return FirebaseManager.auth().signInWithEmailAndPassword(
      email,
      password
    ).then((res) => {
      console.log(res);

      if (!res.user) {
        return Promise.reject(new Error('User not found'));
      }

      return Promise.resolve(res.user);
    });
  }

  updateCurrentUser() {
    // save user to session storage
    this.storage.set(AuthService.KEY_USER, this.user);
  }

  signOut() {
    // clear current user
    FirebaseManager.getInstance().signOut();

    // clear storage
    this.storage.remove(AuthService.KEY_USER);

    this.user = null;
  }
}
