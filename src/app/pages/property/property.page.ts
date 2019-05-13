import { Component, OnInit } from '@angular/core';
import {NavService} from '../../services/nav.service';
import {Property} from '../../models/property';

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
})
export class PropertyPage implements OnInit {

  data: Property;

  constructor(
    public nav: NavService
  ) {
    // get parameter
    this.data = this.nav.get('data');
  }

  ngOnInit() {
  }

}
