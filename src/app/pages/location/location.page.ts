import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {config} from '../../helpers/config';
import {PropertyService} from '../../services/property/property.service';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  mapLat: number;
  mapLng: number;
  zoom: number;

  readOnly = true;

  placeTitle = '';
  placeAddress = '';

  // clicked the place on the map
  clickedPlace = false;

  @ViewChild('searchPlace', { read: ElementRef }) public searchbarElement: ElementRef;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private propService: PropertyService,
    public auth: AuthService,
    private mapApiLoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    // init data
    this.placeAddress = this.propService.address;
    this.lat = this.propService.lat;
    this.lng = this.propService.lng;

    const location = this.route.snapshot.paramMap.get('location');
    if (location) {
      const latlng = location.split(',');

      this.lat = +latlng[0];
      this.lng = +latlng[1];
    }

    const readOnly = this.route.snapshot.paramMap.get('readonly');
    if (readOnly) {
      this.readOnly = (readOnly === 'true');
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidEnter() {
    // init for autocomplete
    this.mapApiLoader.load().then(() => {
      const searchInput = this.searchbarElement.nativeElement.querySelector('.searchbar-input');

      const autocomplete = new google.maps.places.Autocomplete(
        searchInput,
        {
          types: ['address']
        }
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.placeTitle = place.name;

          // set latitude, longitude and zoom
          this.mapLat = place.geometry.location.lat();
          this.mapLng = place.geometry.location.lng();

          if (!this.readOnly) {
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.placeAddress = place.formatted_address;
          }
          this.zoom = 12;
        });
      });
    });

  }


  async loadMap() {
    // options
    this.zoom = 12;

    // get current location
    if (this.lat && this.lng) {
      this.mapLat = this.lat;
      this.mapLng = this.lng;
    }
    else if (navigator)
    {
      // get current location
      navigator.geolocation.getCurrentPosition( pos => {
        console.log('current location', pos.coords.longitude, pos.coords.latitude);

        this.mapLng = +pos.coords.longitude;
        this.mapLat = +pos.coords.latitude;
      });
    }

    else if (this.auth.user && this.auth.user.lat && this.auth.user.lng) {
      // Get the location of you
      this.mapLat = this.auth.user.lat;
      this.mapLng = this.auth.user.lng;
    } else {
      // init location to Torronto
      this.mapLat = 43.6532;
      this.mapLng = -79.3849;
      this.zoom = 15;
    }
  }

  onClickMap(event) {
    if (this.readOnly) {
      return;
    }

    this.lat = event.coords.lat;
    this.lng = event.coords.lng;

    console.log(event);

    this.placeAddress = '';
    this.clickedPlace = false;

    const geocoder = new google.maps.Geocoder();
    const req = {
      location: new google.maps.LatLng(this.lat, this.lng),
      placeId: null,
    };
    if (event.placeId) {
      req.placeId = event.placeId;
      req.location = null;

      this.clickedPlace = true;
    }

    geocoder.geocode(req, (results, status) => {
      console.log(results);

      if (results.length === 0) {
        // Not found
        return null;
      }

      this.placeAddress = results[0].formatted_address;
    });
  }

  onButDone() {
    // set data
    this.propService.address = this.placeAddress;
    this.propService.lat = this.lat;
    this.propService.lng = this.lng;

    this.navCtrl.pop();
  }
}
