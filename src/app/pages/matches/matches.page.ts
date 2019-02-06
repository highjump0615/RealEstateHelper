import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {

  PAGE_BUYER = 0;
  PAGE_SELLER = 1;

  currentPage = this.PAGE_BUYER;

  constructor() { }

  ngOnInit() {
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
