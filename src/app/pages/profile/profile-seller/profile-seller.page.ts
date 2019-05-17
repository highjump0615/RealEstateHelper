import { Component, OnInit } from '@angular/core';
import {BaseClientPage} from '../../base-client.page';
import {NavService} from '../../../services/nav.service';
import {ApiService} from '../../../services/api/api.service';
import {Property} from '../../../models/property';

@Component({
  selector: 'app-profile-seller',
  templateUrl: './profile-seller.page.html',
  styleUrls: ['../profile-buyer/profile-buyer.page.scss'],
})
export class ProfileSellerPage extends BaseClientPage implements OnInit {

  property: Property = null;

  constructor(
    public nav: NavService,
    public api: ApiService
  ) {
    super(nav);
  }

  ngOnInit() {
    if (!this.data) {
      return;
    }

    // fetch property
    this.api.fetchPropertyWithId(this.data.propertyId)
      .then((p) => {
        console.log(p);

        this.property = p;
      });
  }
}
