import {Client} from '../models/client';
import {NavService} from '../services/nav.service';

export class BaseClientPage {
  data: Client;

  constructor(
    public nav: NavService
  ) {
    // get parameter
    this.data = this.nav.get('data');
  }

  onAddNote() {
    this.nav.push('note-add', {
      data: this.data
    });
  }
}
