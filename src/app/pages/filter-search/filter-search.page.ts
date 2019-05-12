import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PropertyService} from '../../services/property/property.service';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.page.html',
  styleUrls: ['./filter-search.page.scss'],
})
export class FilterSearchPage implements OnInit {

  TARGET_BUYER = 'buyer';
  TARGET_SELLER = 'seller';

  target = this.TARGET_BUYER;
  distance = 12;

  constructor(
    private router: Router,
    private propService: PropertyService
  ) { }

  ngOnInit() {
  }

  onFocusLocation() {
    // go to map page
    this.propService.gotoMapForLocation();
  }

  onFocusLot() {
    console.log('asdf');
  }
}
