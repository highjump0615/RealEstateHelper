import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  Environment,
  GoogleMap,
  GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, Marker, MyLocation,
  Geocoder, GeocoderRequest, ILatLng, GeocoderResult, LatLng
} from '@ionic-native/google-maps';
import {NavController, Platform} from '@ionic/angular';
import {config} from '../../helpers/config';
import {PropertyService} from '../../services/property/property.service';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, AfterViewInit {

  map: GoogleMap;
  address: string;
  lat: number;
  lng: number;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private propService: PropertyService,
    public auth: AuthService
  ) {
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  ngOnInit() {
    // init data
    this.address = this.propService.address;
    this.lat = this.propService.lat;
    this.lng = this.propService.lng;
  }

  async loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': config.googleMapApiKey,
      'API_KEY_FOR_BROWSER_DEBUG': config.googleMapApiKey
    });

    // options
    let zoom = 12;

    // get current location
    let latlng = null;
    if (this.lat && this.lng) {
      latlng = new LatLng(this.lat, this.lng);
    } else if (this.auth.user.lat && this.auth.user.lng) {
      // Get the location of you
      latlng = new LatLng(this.auth.user.lat, this.auth.user.lng);
    } else {
      // init location to Torronto
      latlng = new LatLng(43.6532, -79.3849);
      zoom = 15;
    }

    console.log(latlng);

    // create map
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: latlng,
        zoom: zoom,
        tilt: 30
      }
    });

    if (this.lat && this.lng) {
      latlng = new LatLng(this.lat, this.lng);
      this.showMarker(latlng);
    }

    this.map.on(GoogleMapsEvent.MAP_CLICK)
        .subscribe(
            (params: any[]) => {
              this.showMarker(params[0] as ILatLng);
            }
        );
  }

  async showMarker(latLng, addr = null) {
    // clear all markers
    this.map.clear();

    const marker: Marker = this.map.addMarkerSync({
      'position': latLng
    });

    this.lat = latLng.lat;
    this.lng = latLng.lng;

    if (!addr) {
      try {
        const results = await Geocoder.geocode({
          'position': latLng
        }) as GeocoderResult[];

        console.log(results);

        if (results.length === 0) {
          // Not found
          return null;
        }

        // address text
        const country = results[0].country;
        let address = '';
        for (const strLine of results[0].extra.lines) {
          if (strLine === country) {
            address += strLine;
            break;
          }

          address += `${strLine}, `;
        }

        this.address = address;
      } catch (e) {
        console.log(e);
      }
    }

    marker.setTitle(this.address);
    marker.showInfoWindow();
  }

  onButDone() {
    // set data
    this.propService.address = this.address;
    this.propService.lat = this.lat;
    this.propService.lng = this.lng;

    this.navCtrl.pop();
  }
}
