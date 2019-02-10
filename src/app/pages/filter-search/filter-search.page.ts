import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
