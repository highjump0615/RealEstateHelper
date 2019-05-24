import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../base.page';
import {LoadingController} from '@ionic/angular';
import {Client} from '../../../models/client';
import {NavService} from '../../../services/nav.service';
import {ApiService} from '../../../services/api/api.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage extends BasePage implements OnInit {

  TYPE_BUYER = 0;
  TYPE_SELLER = 1;

  currentPage = this.TYPE_BUYER;

  showLoading = false;
  clients: Array<Client> = [];

  type = this.TYPE_BUYER;

  constructor(
    public loadingCtrl: LoadingController,
    public nav: NavService,
    public api: ApiService,
  ) {
    super(loadingCtrl);

    // get parameter
    const c = nav.get('data');

    this.type = c.type;
  }

  ngOnInit() {
    this.showLoadingView(true, 'Searching for required buyers...');

    this.filterData();
  }

  private async filterData() {
    try {
      if (this.type === this.TYPE_BUYER) {
        this.clients = await this.api.getAllBuyers();
      }

      console.log(this.clients);
    }
    finally {
      // hide loading mask
      this.showLoading = false;
      this.showLoadingView(false);
    }
  }
}
