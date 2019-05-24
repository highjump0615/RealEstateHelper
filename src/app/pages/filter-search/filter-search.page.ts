import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PropertyService} from '../../services/property/property.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {BaseClientAddPage} from '../base-client-add.page';
import {NavService} from '../../services/nav.service';
import {Client} from '../../models/client';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.page.html',
  styleUrls: ['./filter-search.page.scss'],
})
export class FilterSearchPage extends BaseClientAddPage implements OnInit {

  target = this.PAGE_BUYER;
  distance = 12;

  constructor(
    public nav: NavService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
  ) {
    super(loadingCtrl, alertCtrl, propService);

  }

  ngOnInit() {
  }

  onButSearch() {
    // set object
    const c = new Client();
    c.type = this.target === this.PAGE_BUYER ?
      Client.CLIENT_TYPE_BUYER :
      Client.CLIENT_TYPE_SELLER;

    this.nav.push('filter-search/clients', {
      data: c
    });
  }
}
