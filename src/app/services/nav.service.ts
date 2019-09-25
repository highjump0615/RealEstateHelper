import { Injectable } from '@angular/core';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  data: any;

  constructor(public navCtrl: NavController) {
    // ...
  }

  push(url: string, data: any = null) {
    this.data = data;

    this.navCtrl.navigateForward('/' + url);
  }

  pop(url) {
    this.navCtrl.navigateBack('/' + url);
  }

  get(key: string) {
    if (!this.data) {
      return null;
    }

    return this.data[key];
  }
}
