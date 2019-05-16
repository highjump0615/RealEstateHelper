import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Property} from '../../../models/property';
import {Client} from '../../../models/client';
import {ApiService} from '../../../services/api/api.service';

@Component({
  selector: 'app-buyers',
  templateUrl: './buyers.page.html',
  styleUrls: ['./buyers.page.scss'],
})
export class BuyersPage implements OnInit {

  showLoading = true;

  sellerId = '';
  buyers: Array<Client> = [];

  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
  ) {
    this.sellerId = this.route.snapshot.params['sellerId'];
  }

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    try {
      // fetch all properties
      this.buyers = await this.api.getFavouriteBuyersOfSeller(this.sellerId);

      console.log(this.buyers);

    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading = false;
    }
  }

}
