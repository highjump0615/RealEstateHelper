import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthService} from "../../../services/auth/auth.service";
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-select-buyer',
  templateUrl: './select-buyer.page.html',
  styleUrls: ['./select-buyer.page.scss'],
})
export class SelectBuyerPage implements OnInit {

  showLoading = false;

  constructor(
    public navCtrl: NavController,
    private auth: AuthService,
    public api: ApiService,
  ) { }

  async ngOnInit() {
    if (this.auth.user.buyers) {
      // already initialized
      return;
    }

    this.showLoading = true;

    try {
      this.auth.user.buyers = await this.api.fetchClients(true);

      console.log(this.auth.user.buyers);
    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading = false;
    }
  }

  onButNext() {
    // back to prev page
    this.navCtrl.pop();
  }
}
