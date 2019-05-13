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

  push(url: string, data: any = '') {
    this.data = data;

    this.navCtrl.navigateForward('/' + url);
  }

  pop(url) {
    this.navCtrl.navigateBack('/' + url);
  }

  get(key: string) {
    return this.data[key];
  }
}
