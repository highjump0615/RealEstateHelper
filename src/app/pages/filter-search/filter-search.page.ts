import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PropertyService} from '../../services/property/property.service';
import {AlertController, LoadingController, NavController, PickerController} from '@ionic/angular';
import {BaseClientAddPage} from '../base-client-add.page';
import {NavService} from '../../services/nav.service';
import {Client} from '../../models/client';
import {Property} from '../../models/property';

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
    public pickerCtrl: PickerController,
  ) {
    super(loadingCtrl, alertCtrl, propService, pickerCtrl);

  }

  ngOnInit() {
  }

  onButSearch() {
    // set object
    const c = new Client();
    c.propRequest = new Property();

    c.type = this.target === this.PAGE_BUYER ?
      Client.CLIENT_TYPE_BUYER :
      Client.CLIENT_TYPE_SELLER;

    c.priceMin = this.unmask(this.priceMin);
    c.priceMax = this.unmask(this.priceMax);

    c.propRequest.style = this.styles;
    c.propRequest.type = this.types;
    c.propRequest.basement = this.basements;
    c.propRequest.status = this.constStatus;
    c.propRequest.garage = this.garages;

    c.propRequest.location = this.propService.getLocation();
    c.radius = this.distance;

    c.sizeMin = this.unmask(this.sizeMin);
    c.sizeMax = this.unmask(this.sizeMax);

    c.propRequest.bedroom = this.bedroom;
    c.propRequest.bathroom = this.bathroom;
    c.propRequest.lotFrontage = this.frontage;
    c.propRequest.lotDepth = this.depth;

    this.nav.push('filter-search/clients', {
      data: c
    });
  }
}
