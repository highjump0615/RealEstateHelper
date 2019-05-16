import {NavService} from '../services/nav.service';
import {AuthService} from '../services/auth/auth.service';

export class BasePropertiesPage {
  constructor(
    public auth: AuthService,
    public nav: NavService,
  ) {
  }

  onPropertyItem(prop) {
    this.nav.push('property', {
      data: prop
    });
  }

}
