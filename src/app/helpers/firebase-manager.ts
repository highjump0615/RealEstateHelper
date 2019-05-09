import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import {config} from './config';

export class FirebaseManager {

  static ServerOffset = 0.0;

  private static instance: FirebaseManager;

  static getInstance() {
    if (!this.instance) {
      this.instance = new FirebaseManager();
      this.instance.init();
    }

    return this.instance;
  }

  static auth() {
    return firebase.auth();
  }

  static ref() {
    return firebase.database().ref();
  }

  static getGoogleAuthCredential(token) {
    return firebase.auth.GoogleAuthProvider.credential(token);
  }

  static getFbAuthCredential(token) {
    return firebase.auth
      .FacebookAuthProvider
      .credential(token);
  }

  uploadImageTo(path, imgData) {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(path);

    return imageRef.putString(imgData, 'data_url')
      .then((snapshot) => {
        // get download url
        return imageRef.getDownloadURL().then((url) => {
          console.log('url: ' + url);

          return url;
        });
      });
  }

  init() {
    firebase.initializeApp(config.firebase);
    this.initServerTime();
  }

  initServerTime() {
    const serverTimeQuery = FirebaseManager.ref().child('.info/serverTimeOffset');
    serverTimeQuery
      .once('value')
      .then((snapshot) => {
        FirebaseManager.ServerOffset = snapshot.val();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getServerLongTime() {
    const estimatedServerTimeMs = Date.now() + FirebaseManager.ServerOffset;
    return estimatedServerTimeMs;
  }

  signOut() {
    // Log out
    FirebaseManager.auth().signOut();
  }

}
