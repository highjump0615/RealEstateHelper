import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from '../../base-segment.page';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage extends BaseSegmentPage implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
