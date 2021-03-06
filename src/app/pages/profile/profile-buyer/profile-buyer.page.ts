import { Component, OnInit } from '@angular/core';
import {NavService} from '../../../services/nav.service';
import {BaseClientPage} from '../../base-client.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-buyer',
  templateUrl: './profile-buyer.page.html',
  styleUrls: ['./profile-buyer.page.scss'],
})
export class ProfileBuyerPage extends BaseClientPage implements OnInit {

  constructor(
    public nav: NavService,
    public router: Router,
  ) {
    super(nav, router);
  }

  ngOnInit() {
  }
}
