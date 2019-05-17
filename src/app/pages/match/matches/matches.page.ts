import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {Property} from '../../../models/property';
import {Client} from '../../../models/client';
import {GeoFire} from 'geofire';
import {Utils} from '../../../helpers/utils';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage extends BaseSegmentPage implements OnInit {

  showLoading = true;

  matchedBuyers: Array<Client>;
  matchedSellers: Array<Client>;

  constructor(
    private auth: AuthService,
    public api: ApiService,
  ) {
    super(null, null);
  }

  ngOnInit() {
    // get data
    this.getData();
  }

  isBuyerMatching(buyer: Client, prop: Property) {
    const propReq = buyer.propRequest;

    //
    // price
    //
    if (!(buyer.priceMin <= prop.price && prop.price <= buyer.priceMax)) {
      return false;
    }

    //
    // location
    //
    if (propReq.location && buyer.radius) {
      const distance = GeoFire.distance(propReq.location, prop.location);
      if (distance > buyer.radius) {
        return false;
      }
    }

    // style
    if (!Utils.compareArrays(propReq.style, prop.style)) {
      return false;
    }

    // type
    if (!Utils.compareArrays(propReq.type, prop.type)) {
      return false;
    }

    // size
    if (!(buyer.sizeMin <= prop.size && prop.size <= buyer.sizeMax)) {
      return false;
    }

    // bedrooms
    if (propReq.bedroom !== prop.bedroom) {
      return false;
    }

    // bathrooms
    if (propReq.bathroom !== prop.bathroom) {
      return false;
    }

    // bedrooms
    if (propReq.garage !== prop.garage) {
      return false;
    }

    // basement
    if (propReq.basement !== prop.basement) {
      return false;
    }

    // lot

    // status
    if (propReq.status !== prop.status) {
      return false;
    }

    return true;
  }

  async getData() {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    try {
      if (isBuyer) {
        //
        // My buyers
        //
        if (!this.matchedBuyers) {
          this.showLoading = true;
        }

        if (!this.auth.user.buyers) {
          // fetch buyers
          this.auth.user.buyers = await this.api.fetchClients(true);
        }

        // fetch all properties
        const props = await this.api.getAllProperties();

        // clear
        this.matchedBuyers = [];

        // check matching
        for (const prop of props) {
          for (const buyer of this.auth.user.buyers) {
            const propReq = buyer.propRequest;

            if (!this.isBuyerMatching(buyer, prop)) {
              continue;
            }

            // add to matched buyers
            buyer.matchedProperties.push(prop);
            this.matchedBuyers.push(buyer);
          }
        }
      } else {
        //
        // My sellers
        //
        if (!this.matchedSellers) {
          this.showLoading = true;
        }

        if (!this.auth.user.sellers) {
          // fetch buyers
          this.auth.user.sellers = await this.api.fetchClients(false);
        }

        // fetch all buyers
        const buyers = await this.api.getAllBuyers();

        // clear
        this.matchedSellers = [];

        for (const seller of this.auth.user.sellers) {
          // fetch property of seller if needed
          if (!seller.property) {
            seller.property = await this.api.fetchPropertyWithId(seller.propertyId);
          }

          for (const buyer of buyers) {
            if (!this.isBuyerMatching(buyer, seller.property)) {
              continue;
            }

            // add to matched buyers
            seller.matchedBuyers.push(buyer);
            this.matchedSellers.push(seller);
          }
        }
      }
    } finally {
      // close loading
      this.showLoading = false;
    }

  }

  onPageChanged(page: number) {
    console.log('onPageChanged');

    super.onPageChanged(page);

    this.getData();
  }

  async doRefresh(event) {
    await this.getData();

    event.target.complete();
  }
}
