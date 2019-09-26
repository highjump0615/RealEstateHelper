import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api/api.service';
import {Property} from '../../../models/property';
import {Client} from '../../../models/client';
import {GeoFire} from 'geofire';
import {Utils} from '../../../helpers/utils';
import {NavService} from '../../../services/nav.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage extends BaseSegmentPage implements OnInit {

  showLoading = true;

  matchedBuyers: Array<Client>;
  matchedBuyersFiltered: Array<Client> = [];
  matchedSellers: Array<Client>;
  matchedSellersFiltered: Array<Client> = [];

  keywordBuyer = '';
  keywordSeller = '';

  constructor(
    private auth: AuthService,
    public api: ApiService,
    public nav: NavService,
  ) {
    super(null, null);
  }

  ngOnInit() {
    // get data
    this.getData();
  }

  isBuyerMatching(buyer: Client, prop: Property) {
    if (buyer.isPropRequestEmpty()) {
      return false;
    }

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
    if (propReq.location && prop.location && buyer.radius) {
      const distance = GeoFire.distance(propReq.location, prop.location);
      if (distance > buyer.radius) {
        return false;
      }
    }

    // style
    if (propReq.style && prop.style) {
      if (!Utils.compareArrays(propReq.style, prop.style)) {
        return false;
      }
    }

    // type
    if (propReq.type && prop.type) {
      if (!Utils.compareArrays(propReq.type, prop.type)) {
        return false;
      }
    }

    // size
    if (prop.size && (buyer.sizeMin || buyer.sizeMax)) {
      if (!(buyer.sizeMin <= prop.size && prop.size <= buyer.sizeMax)) {
        return false;
      }
    }

    // bedrooms
    if (propReq.bedroom && prop.bedroom) {
      if (propReq.bedroom !== prop.bedroom) {
        return false;
      }
    }

    // bathrooms
    if (propReq.bathroom && prop.bathroom) {
      if (propReq.bathroom !== prop.bathroom) {
        return false;
      }
    }

    // garage
    if (propReq.garage && prop.garage) {
      if (!Utils.compareArrays(propReq.garage, prop.garage)) {
        return false;
      }
    }

    // basement
    if (propReq.basement && prop.basement) {
      if (!Utils.compareArrays(propReq.basement, prop.basement)) {
        return false;
      }
    }

    // lot

    // status
    if (propReq.status && prop.status) {
      if (!Utils.compareArrays(propReq.status, prop.status)) {
        return false;
      }
    }

    return true;
  }

  async getData(isRefresh = false) {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    try {
      if (isBuyer) {
        //
        // My buyers
        //
        if (!this.matchedBuyers) {
          if (!isRefresh) {
            this.showLoading = true;
          }
        } else {
          // already fetched
          if (!isRefresh) {
            return;
          }
        }


        if (!this.auth.user.buyers) {
          // fetch buyers
          this.auth.user.buyers = await this.api.fetchClients(true);
        }

        console.log(this.auth.user.buyers);

        // init
        for (const buyer of this.auth.user.buyers) {
          buyer.matchedProperties = [];
        }

        // fetch all properties
        const props = await this.api.getAllProperties();

        // clear
        this.matchedBuyers = [];

        // check matching
        for (const buyer of this.auth.user.buyers) {
          for (const prop of props) {
            const propReq = buyer.propRequest;
            if (propReq.location && prop.location) {
              prop.distance = GeoFire.distance(prop.location, propReq.location);
            }

            if (!this.isBuyerMatching(buyer, prop)) {
              continue;
            }

            // add to matched buyers
            buyer.matchedProperties.push(prop);
          }

          this.matchedBuyers.push(buyer);
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
          seller.matchedBuyers = [];

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
          }

          // add to list if it has matched buyers
          if (seller.matchedBuyers.length > 0) {
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

  onItemBuyer(item: Client) {
    this.nav.push('match-property', {
      data: item
    });
  }

  onItemSeller(item: Client) {
    this.nav.push('match-buyer', {
      data: item
    });
  }

  onSearch() {
    if (this.currentPage === this.PAGE_BUYER) {
      // filter
      if (this.keywordBuyer) {
        const keyword = this.keywordBuyer.toLowerCase();
        const buyersFiltered = [];

        for (const c of this.matchedBuyers) {
          // name
          if (c.name.toLowerCase().indexOf(keyword) >= 0) {
            buyersFiltered.push(c);
          }
          // address
          else if (c.address.toLowerCase().indexOf(keyword) >= 0) {
            buyersFiltered.push(c);
          }
        }

        this.matchedBuyersFiltered = buyersFiltered;
      }
    }
    else {
      // filter
      if (this.keywordSeller) {
        const keyword = this.keywordSeller.toLowerCase();
        const sellersFiltered = [];

        for (const c of this.matchedSellers) {
          // name
          if (c.name.toLowerCase().indexOf(keyword) >= 0) {
            sellersFiltered.push(c);
          }
        }

        this.matchedSellersFiltered = sellersFiltered;
      }
    }
  }

  getMatchedBuyers() {
    if (this.keywordBuyer) {
      return this.matchedBuyersFiltered;
    }

    return this.matchedBuyers;
  }

  getMatchedSellers() {
    if (this.keywordSeller) {
      return this.matchedSellersFiltered;
    }

    return this.matchedSellers;
  }

  getNotice(tab) {
    if (this.showLoading) {
      return '';
    }

    if (tab === this.PAGE_BUYER) {
      if (this.keywordBuyer) {
        if (this.matchedBuyersFiltered.length <= 0) {
          return 'Not found matched buyers with the keyword';
        }
      }
      else {
        if (!this.matchedBuyers || this.matchedBuyers.length <= 0) {
          return 'No matched buyers yet';
        }
      }
    }
    else {
      if (this.keywordSeller) {
        if (this.matchedSellersFiltered.length <= 0) {
          return 'Not found matched sellers with the keyword';
        }
      }
      else {
        if (!this.matchedSellers || this.matchedSellers.length <= 0) {
          return 'No matched sellers yet';
        }
      }
    }

    return '';
  }
}
