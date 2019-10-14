import { Component, OnInit } from '@angular/core';
import {NavService} from '../../services/nav.service';
import {Property} from '../../models/property';
import {Router} from "@angular/router";

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
})
export class PropertyPage implements OnInit {

  data: Property;

  constructor(
    public nav: NavService,
    public router: Router,
  ) {
    // get parameter
    this.data = this.nav.get('data');
  }

  ngOnInit() {
  }

  onButFavourite() {
    this.nav.push('select-buyer', {
      data: this.data
    });
  }

  goToLocation(prop, event) {
    this.router.navigate(['/location', {
      location: prop.location
    }]);

    event.stopPropagation();
    return false;
  }
}
