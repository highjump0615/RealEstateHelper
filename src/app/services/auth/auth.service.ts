import { Injectable } from '@angular/core';
import {User} from '../../models/user';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {User as FUser} from 'firebase';
import {Storage} from '@ionic/storage';
import * as firebase from 'firebase/app';

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

  socialSignIn(credential) {
    return FirebaseManager.auth().signInAndRetrieveDataWithCredential(credential)
      .then((res) => {
        if (!res.user) {
          const err = new Error('User not available');
          return Promise.reject(new Error('User not available'));
        }

        return Promise.resolve(res.user);
      });
  }

  resetPassword(email) {
    // do login
    return FirebaseManager.auth().sendPasswordResetEmail(email);
  }

  updateCurrentUser() {
    // save user to session storage
    this.storage.set(AuthService.KEY_USER, this.user);
  }

  async changePassword(oldPwd, newPwd) {
    const cred = firebase.auth.EmailAuthProvider.credential(
      this.user.email,
      oldPwd,
    );

    // check old password
    await FirebaseManager.auth().currentUser.reauthenticateWithCredential(cred);

    // update password
    await FirebaseManager.auth().currentUser.updatePassword(newPwd);
  }

  signOut() {
    // clear current user
    FirebaseManager.getInstance().signOut();

    // clear storage
    this.storage.remove(AuthService.KEY_USER);

    this.user = null;
  }
}
