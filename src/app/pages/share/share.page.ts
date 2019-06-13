import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from "@ionic/angular";
import {Utils} from "../../helpers/utils";

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {
  email = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl?: AlertController,
  ) { }

  ngOnInit() {
  }

  async onButShare() {
    // check email validity
    if (!Utils.isEmailValid(this.email)) {
      // show error alert
      const alert = await this.alertCtrl.create({
        header: 'Invalid email address',
        message: 'Cannot be sent to that email',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    // back to prev page
    this.navCtrl.pop();
  }
}
