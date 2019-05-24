import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PropertyService} from '../../services/property/property.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {BaseClientAddPage} from '../base-client-add.page';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.page.html',
  styleUrls: ['./filter-search.page.scss'],
})
export class FilterSearchPage extends BaseClientAddPage implements OnInit {

  TARGET_BUYER = 'buyer';
  TARGET_SELLER = 'seller';

  target = this.TARGET_BUYER;
  distance = 12;

  constructor(
    private router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public propService: PropertyService,
  ) {
    super(loadingCtrl, alertCtrl, propService);

  }

  ngOnInit() {
  }

  onButSearch() {
  }
}
