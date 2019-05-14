import {Client} from '../models/client';
import {NavService} from '../services/nav.service';

export class BaseCustomerPage {
  data: Client;

  constructor(
    public nav: NavService
  ) {
    // get parameter
    this.data = this.nav.get('data');
  }
}
