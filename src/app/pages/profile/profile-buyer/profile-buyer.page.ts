import { Component, OnInit } from '@angular/core';
import {NavService} from '../../../services/nav.service';
import {BaseCustomerPage} from '../../base-customer.page';

@Component({
  selector: 'app-profile-buyer',
  templateUrl: './profile-buyer.page.html',
  styleUrls: ['./profile-buyer.page.scss'],
})
export class ProfileBuyerPage extends BaseCustomerPage implements OnInit {

  constructor(
    public nav: NavService
  ) {
    super(nav);
  }

  ngOnInit() {
  }

}
