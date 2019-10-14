import {Client} from '../models/client';
import {NavService} from '../services/nav.service';
import {Router} from '@angular/router';

export class BaseClientPage {
  data: Client;

  constructor(
    public nav: NavService,
    public router: Router,
  ) {
    // get parameter
    this.data = this.nav.get('data');
  }

  onAddNote() {
    this.nav.push('note-add', {
      data: this.data
    });
  }

  onButEdit() {
    this.nav.push('profile-add', {
      data: this.data
    });
  }

  goToLocation(client, event) {
    this.router.navigate(['/location', {
      location: client.getLocation()
    }]);

    event.stopPropagation();
    return false;
  }
}
