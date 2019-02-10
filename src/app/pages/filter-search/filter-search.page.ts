import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

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
    private router: Router
  ) { }

  ngOnInit() {
  }

  onFocusLocation() {
    console.log('asdf');

    // go to map page
    this.router.navigate(['location']);
  }
}
