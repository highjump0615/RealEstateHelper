import { Component, OnInit } from '@angular/core';
import {AlertController, NavParams} from '@ionic/angular';
import {ViewController} from '@ionic/core';
import {MatchBuyerPage} from '../../pages/match/match-buyer/match-buyer.page';

@Component({
  selector: 'app-remove-button',
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss']
})
export class RemoveButtonComponent implements OnInit {

  parentPage: any;

  constructor(
    navParams: NavParams
  ) {
    this.parentPage = navParams.get('parent');
  }

  ngOnInit() {
  }

  onButRemove() {
    (this.parentPage as MatchBuyerPage).onDelete();
  }
}
