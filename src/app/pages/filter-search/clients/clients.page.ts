import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../base.page';
import {LoadingController} from '@ionic/angular';
import {Client} from '../../../models/client';
import {NavService} from '../../../services/nav.service';
import {ApiService} from '../../../services/api/api.service';
import {GeoFire} from 'geofire';
import {AuthService} from '../../../services/auth/auth.service';
import {Utils} from '../../../helpers/utils';
import {Property} from "../../../models/property";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage extends BasePage implements OnInit {

  static PAGE_COUNT = 20;

  TYPE_BUYER = 0;
  TYPE_SELLER = 1;

  currentPage = this.TYPE_BUYER;

  showLoading = true;

  private clientAll: Array<Client> = [];
  clients: Array<Client> = [];

  filterClient: Client;
  matchCount = 0;

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

  async ngOnInit() {
    let strDesc = 'Searching for required buyers...';
    if (this.filterClient.type === this.TYPE_SELLER) {
      strDesc = 'Searching for required sellers...';
    }
    await this.showLoadingView(true, strDesc);

    this.loadData();
  }

  private async loadData() {
    this.clientAll = [];

    try {
      // load data
      if (this.filterClient.type === this.TYPE_BUYER) {
        const buyersAll = await this.api.getAllBuyers();

        for (const buyer of buyersAll) {
          if (this.isClientMatching(buyer) > 0) {
            this.clientAll.push(buyer);
          }
        }

      } else {
        const propsAll = await this.api.getAllProperties();
        const proms = [];

        for (const prop of propsAll) {
          if (this.isPropertyMatching(prop) > 0) {
            const prom = this.api.fetchClientWithId(prop.sellerId, false)
                .then((client) => {
                  client.property = prop;

                  return Promise.resolve(client);
                });

            proms.push(prom);
          }
        }

        // fetch clients
        this.clientAll = await Promise.all(proms);
      }

    } catch (e) {
      console.log(e);
    }

    this.filterData();
  }

  private async filterData() {
    try {
      const clientsTemp = [];
      const proms = [];

      for (const c of this.clientAll) {
        if (c.agent) {
          continue;
        }

        // fetch agent
        const prom = this.api.getUserWithId(c.agentId)
            .then((u) => {
              c.agent = u;
            });
        proms.push(prom);
        clientsTemp.push(c);

        if (clientsTemp.length >= ClientsPage.PAGE_COUNT) {
          break;
        }
      }

      await Promise.all(proms);
      console.log(clientsTemp);

      this.clients = this.clients.concat(clientsTemp);
    }
    finally {
      // hide loading mask
      this.showLoading = false;

      setTimeout(() => {
        this.showLoadingView(false);
      }, 100);
    }
  }

  async loadMoreData(event) {
    await this.filterData();

    event.target.complete();

    // check if all loaded
    if (this.clients.length >= this.clientAll.length) {
      event.target.disabled = true;
    }
  }

  getPropertyImage(client) {
    if (client.property && client.property.getPhotoUrl()) {
      return client.property.getPhotoUrl();
    }

    return '../../../../assets/imgs/default_img.png';
  }

  getClientTitle(client) {
    if (client.property && client.property.title) {
      return client.property.title;
    }

    return `Seller Code: ${client.getIdReadable()}`;
  }

  isClientMatching(client): number {
    let nMatch = 0;
    let nMatchMax = 0;

    //
    // show all for no filter
    //
    if (this.filterClient.isPropRequestEmpty()) {
      return 1;
    }

    // location
    if (this.filterClient.propRequest.location) {
      nMatchMax++;

      if (client.propRequest.location) {
        client.propRequest.distance = GeoFire.distance(
          client.propRequest.location,
          this.filterClient.propRequest.location
        );

        if (client.propRequest.distance <= this.filterClient.radius) {
          nMatch++;
        }
      }
    }

    // price
    if (this.filterClient.priceMin || this.filterClient.priceMax) {
      nMatchMax++;
    }
    if (this.filterClient.isPriceMatching(client)) {
      nMatch++;
    }

    // size
    if (this.filterClient.sizeMin || this.filterClient.sizeMax) {
      nMatchMax++;
    }
    if (this.filterClient.isSizeMatching(client)) {
      nMatch++;
    }

    // styles
    if (this.filterClient.propRequest.style.length > 0) {
      nMatchMax++;
    }
    if (this.filterClient.propRequest.style.find((s) => s === Property.OPTION_ANY)
      ||
      Utils.containsArray(
        client.propRequest.style,
        this.filterClient.propRequest.style
      )
    ) {
      nMatch++;
    }

    // types
    if (this.filterClient.propRequest.type.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      client.propRequest.type,
      this.filterClient.propRequest.type)) {

      nMatch++;
    }

    // garage
    if (this.filterClient.propRequest.garage.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      client.propRequest.garage,
      this.filterClient.propRequest.garage)) {

      nMatch++;
    }

    // basement
    if (this.filterClient.propRequest.basement.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      client.propRequest.basement,
      this.filterClient.propRequest.basement)) {

      nMatch++;
    }

    // status
    if (this.filterClient.propRequest.status.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      client.propRequest.status,
      this.filterClient.propRequest.status)) {

      nMatch++;
    }

    // bedroom
    if (this.filterClient.propRequest.bedroom) {
      nMatchMax++;
    }
    if (client.propRequest.bedroom >= this.filterClient.propRequest.bedroom) {
      nMatch++;
    }

    // bathroom
    if (this.filterClient.propRequest.bathroom) {
      nMatchMax++;
    }
    if (client.propRequest.bathroom >= this.filterClient.propRequest.bathroom) {
      nMatch++;
    }

    // lot size
    if (this.filterClient.propRequest.lotFrontage) {
      nMatchMax++;
    }
    if (client.propRequest.lotFrontage && client.propRequest.lotFrontage >= this.filterClient.propRequest.lotFrontage) {
      nMatch++;
    }

    // lot depth
    if (this.filterClient.propRequest.lotDepth) {
      nMatchMax++;
    }
    if (client.propRequest.lotDepth && client.propRequest.lotDepth >= this.filterClient.propRequest.lotDepth) {
      nMatch++;
    }

    if (nMatch >= nMatchMax) {
      console.log(client);

      return 1;
    }

    return 0;
  }

  isPropertyMatching(prop) {
    let nMatch = 0;
    let nMatchMax = 0;

    //
    // show all for no filter
    //
    if (this.filterClient.isPropRequestEmpty()) {
      return 1;
    }

    // code
    if (this.filterClient.propRequest.id) {
      nMatchMax++;

      if (prop.getIdReadable() === this.filterClient.propRequest.id) {
        nMatch++;
      }
    }

    // location
    if (this.filterClient.propRequest.location) {
      nMatchMax++;

      if (prop.location) {
        const distance = GeoFire.distance(
          prop.location,
          this.filterClient.propRequest.location
        );

        if (distance <= this.filterClient.radius) {
          nMatch++;
        }
      }
    }

    // price
    if (this.filterClient.priceMin || this.filterClient.priceMax) {
      nMatchMax++;
    }
    if (this.filterClient.isPriceMatchingWithProperty(prop)) {
      nMatch++;
    }

    // size
    if (this.filterClient.sizeMin || this.filterClient.sizeMax) {
      nMatchMax++;
    }
    if (this.filterClient.isSizeMatchingWithProperty(prop)) {
      nMatch++;
    }

    // styles
    if (this.filterClient.propRequest.style.length > 0) {
      nMatchMax++;
    }
    if (this.filterClient.propRequest.style.find((s) => s === Property.OPTION_ANY)
      ||
      Utils.containsArray(
        prop.style,
        this.filterClient.propRequest.style
      )
    ) {
      nMatch++;
    }

    // types
    if (this.filterClient.propRequest.type.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      prop.type,
      this.filterClient.propRequest.type)) {

      nMatch++;
    }

    // garage
    if (this.filterClient.propRequest.garage.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      prop.garage,
      this.filterClient.propRequest.garage)) {

      nMatch++;
    }

    // basement
    if (this.filterClient.propRequest.basement.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      prop.basement,
      this.filterClient.propRequest.basement)) {

      nMatch++;
    }

    // status
    if (this.filterClient.propRequest.status.length > 0) {
      nMatchMax++;
    }
    if (Utils.containsArray(
      prop.status,
      this.filterClient.propRequest.status)) {

      nMatch++;
    }

    // bedroom
    if (this.filterClient.propRequest.bedroom) {
      nMatchMax++;
    }
    if (prop.bedroom >= this.filterClient.propRequest.bedroom) {
      nMatch++;
    }

    // bathroom
    if (this.filterClient.propRequest.bathroom) {
      nMatchMax++;
    }
    if (prop.bathroom >= this.filterClient.propRequest.bathroom) {
      nMatch++;
    }

    // lot size
    if (this.filterClient.propRequest.lotFrontage) {
      nMatchMax++;
    }
    if (prop.lotFrontage && prop.lotFrontage >= this.filterClient.propRequest.lotFrontage) {
      nMatch++;
    }

    // lot depth
    if (this.filterClient.propRequest.lotDepth) {
      nMatchMax++;
    }
    if (prop.lotDepth && prop.lotDepth >= this.filterClient.propRequest.lotDepth) {
      nMatch++;
    }

    if (nMatch >= nMatchMax) {
      console.log(prop.bathroom);

      return 1;
    }

    return 0;
  }

  onItemDetail(item: Client) {
    this.nav.push('profile-data', {
      data: item
    });
  }
}
