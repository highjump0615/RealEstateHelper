import { Component, OnInit } from '@angular/core';
import {NavService} from '../../services/nav.service';
import {Property} from '../../models/property';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';

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
    private route: ActivatedRoute,
    public api: ApiService,
  ) {
  }

  async ngOnInit() {
    const propId = this.route.snapshot.params['id'];

    if (propId) {
      // fetch property from id
      this.data = await this.api.fetchPropertyWithId(propId);
    } else {
      // get parameter
      this.data = this.nav.get('data');
    }
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
