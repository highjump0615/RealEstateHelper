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

  matchedBuyers: Array<Client> = [];

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

  async getData() {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    try {
      if (isBuyer) {
        if (!this.auth.user.buyers) {
          // fetch buyers
          this.auth.user.buyers = await this.api.fetchClients(isBuyer);
        }

        // fetch all properties
        const props = await this.api.getAllProperties();

        // check matching
        for (const prop of props) {
          for (const buyer of this.auth.user.buyers) {
            const propReq = buyer.propRequest;

            //
            // price
            //
            if (!(buyer.priceMin <= prop.price && prop.price <= buyer.priceMax)) {
              continue;
            }

            //
            // location
            //
            if (propReq.location && buyer.radius) {
              const distance = GeoFire.distance(propReq.location, prop.location);
              if (distance > buyer.radius) {
                continue;
              }
            }

            // style
            if (!Utils.compareArrays(propReq.style, prop.style)) {
              continue;
            }

            // type
            if (!Utils.compareArrays(propReq.type, prop.type)) {
              continue;
            }

            // size
            if (!(buyer.sizeMin <= prop.size && prop.size <= buyer.sizeMax)) {
              continue;
            }

            // bedrooms
            if (propReq.bedroom !== prop.bedroom) {
              continue;
            }

            // bathrooms
            if (propReq.bathroom !== prop.bathroom) {
              continue;
            }

            // bedrooms
            if (propReq.garage !== prop.garage) {
              continue;
            }

            // basement
            if (propReq.basement !== prop.basement) {
              continue;
            }

            // lot

            // status
            if (propReq.status !== prop.status) {
              continue;
            }

            // add to matched buyers
            buyer.matchedProperties.push(prop);
            this.matchedBuyers.push(buyer);
          }
        }
      }
    } finally {
      // close loading
      this.showLoading = false;
    }


  }

  async doRefresh(event) {
    await this.getData();

    event.target.complete();
  }
}
