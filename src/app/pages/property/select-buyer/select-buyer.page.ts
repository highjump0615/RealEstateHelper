import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-select-buyer',
  templateUrl: './select-buyer.page.html',
  styleUrls: ['./select-buyer.page.scss'],
})
export class SelectBuyerPage implements OnInit {

  constructor(
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  onButNext() {
    // back to prev page
    this.navCtrl.pop();
  }
}
