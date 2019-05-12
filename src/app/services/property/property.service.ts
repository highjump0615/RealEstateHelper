import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  lat: number;
  lng: number;
  address = '';

  constructor(
    private router: Router
  ) { }

  clearData() {
    this.lat = this.lng = null;
    this.address = '';
  }

  gotoMapForLocation() {
    this.router.navigate(['location']);
  }

  getLocationFormatted() {
    if (this.lat && this.lng) {
      return `(${this.lat.toFixed(4)}, ${this.lng.toFixed(4)})`;
    }

    return '';
  }
}
