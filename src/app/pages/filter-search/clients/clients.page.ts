import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../base.page';
import {LoadingController} from '@ionic/angular';
import {Client} from '../../../models/client';
import {NavService} from '../../../services/nav.service';
import {ApiService} from '../../../services/api/api.service';
import {GeoFire} from 'geofire';
import {AuthService} from '../../../services/auth/auth.service';
import {Utils} from '../../../helpers/utils';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage extends BasePage implements OnInit {

  TYPE_BUYER = 0;
  TYPE_SELLER = 1;

  currentPage = this.TYPE_BUYER;

  showLoading = true;
  clients: Array<Client> = [];

  filterClient: Client;

  constructor(
    public loadingCtrl: LoadingController,
    public nav: NavService,
    public api: ApiService,
    public auth: AuthService,
  ) {
    super(loadingCtrl);

    // get parameter
    this.filterClient = nav.get('data');
  }

  ngOnInit() {
    let strDesc = 'Searching for required buyers...';
    if (this.filterClient.type === this.TYPE_SELLER) {
      strDesc = 'Searching for required sellers...';
    }
    this.showLoadingView(true, strDesc);

    this.filterData();
  }

  private async filterData() {
    try {
      if (this.filterClient.type === this.TYPE_BUYER) {
        const buyersAll = await this.api.getAllBuyers();
        const buyersMatched = [];

        for (const buyer of buyersAll) {
          if (this.isClientMatching(buyer) > 0) {
            buyersMatched.push(buyer);
          }
        }

        this.clients = buyersMatched;
      } else {
        const propsAll = await this.api.getAllProperties();
        const proms = [];

        for (const prop of propsAll) {
          if (this.isPropertyMatching(prop) > 0) {
            const prom = this.api.fetchClientWithId(prop.sellerId, false);
            proms.push(prom);
          }
        }

        // fetch clients
        this.clients = await Promise.all(proms);
      }

      console.log(this.clients);
    }
    finally {
      // hide loading mask
      this.showLoading = false;

      setTimeout(() => {
        this.showLoadingView(false);
      }, 100);
    }
  }

  isClientMatching(client): number {
    let nMatch = 0;

    // location
    if (this.auth.user.lat && this.auth.user.lng) {
      if (client.propRequest.location) {
        client.propRequest.distance = GeoFire.distance(
          client.propRequest.location,
          [
            this.auth.user.lat,
            this.auth.user.lng
          ]);

        if (client.propRequest.distance <= this.filterClient.radius) {
          nMatch++;
        }
      }
    }

    //
    // show all for no filter
    //
    if (this.filterClient.isPropRequestEmpty()) {
      return 1;
    }

    // price
    if (this.filterClient.isPriceMatching(client)) {
      nMatch++;
    }

    // size
    if (this.filterClient.isSizeMatching(client)) {
      nMatch++;
    }

    // styles
    if (Utils.containsArray(
      client.propRequest.style,
      this.filterClient.propRequest.style)) {

      nMatch++;
    }

    // types
    if (Utils.containsArray(
      client.propRequest.type,
      this.filterClient.propRequest.type)) {

      nMatch++;
    }

    // garage
    if (Utils.containsArray(
      client.propRequest.garage,
      this.filterClient.propRequest.garage)) {

      nMatch++;
    }

    // basement
    if (Utils.containsArray(
      client.propRequest.basement,
      this.filterClient.propRequest.basement)) {

      nMatch++;
    }

    // status
    if (Utils.containsArray(
      client.propRequest.status,
      this.filterClient.propRequest.status)) {

      nMatch++;
    }

    // bedroom
    if (client.propRequest.bedroom >= this.filterClient.propRequest.bedroom) {
      nMatch++;
    }

    // bathroom
    if (client.propRequest.bathroom >= this.filterClient.propRequest.bathroom) {
      nMatch++;
    }

    return nMatch;
  }

  isPropertyMatching(prop) {
    let nMatch = 0;

    // location
    if (this.auth.user.lat && this.auth.user.lng) {
      if (prop.location) {
        const distance = GeoFire.distance(
          prop.location,
          [
            this.auth.user.lat,
            this.auth.user.lng
          ]);

        if (distance <= this.filterClient.radius) {
          nMatch++;
        }
      }
    }

    //
    // show all for no filter
    //
    if (this.filterClient.isPropRequestEmpty()) {
      return 1;
    }

    // price
    if (this.filterClient.isPriceMatchingWithProperty(prop)) {
      nMatch++;
    }

    // size
    if (this.filterClient.isSizeMatchingWithProperty(prop)) {
      nMatch++;
    }

    // styles
    if (Utils.containsArray(
      prop.style,
      this.filterClient.propRequest.style)) {

      nMatch++;
    }

    // types
    if (Utils.containsArray(
      prop.type,
      this.filterClient.propRequest.type)) {

      nMatch++;
    }

    // garage
    if (Utils.containsArray(
      prop.garage,
      this.filterClient.propRequest.garage)) {

      nMatch++;
    }

    // basement
    if (Utils.containsArray(
      prop.basement,
      this.filterClient.propRequest.basement)) {

      nMatch++;
    }

    // status
    if (Utils.containsArray(
      prop.status,
      this.filterClient.propRequest.status)) {

      nMatch++;
    }

    // bedroom
    if (prop.bedroom >= this.filterClient.propRequest.bedroom) {
      nMatch++;
    }

    // bathroom
    if (prop.bathroom >= this.filterClient.propRequest.bathroom) {
      nMatch++;
    }

    return nMatch;
  }
}
