import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-signup-profile',
  templateUrl: './signup-profile.page.html',
  styleUrls: ['./signup-profile.page.scss'],
})
export class SignupProfilePage implements OnInit {

  constructor(
    public navCtrl: NavController
  ) {
  }

  ngOnInit() {
  }

  onButBack($event: MouseEvent) {
    // back to prev page
    this.navCtrl.pop();
  }
}
