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
    private propService: PropertyService
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

  loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': config.googleMapApiKey,
      'API_KEY_FOR_BROWSER_DEBUG': config.googleMapApiKey
    });

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 15,
        tilt: 30
      }
    });

    this.goToMyLocation();
    if (this.lat && this.lng) {
      const latlng = new LatLng(this.lat, this.lng);
      this.showMarker(latlng);
    }

    this.map.on(GoogleMapsEvent.MAP_CLICK)
      .subscribe(
        (params: any[]) => {
          this.showMarker(params[0] as ILatLng);
        }
      );

  }

  async goToMyLocation() {
    this.map.clear();

    try {
      let latlng = null;
      if (this.lat && this.lng) {
        latlng = new LatLng(this.lat, this.lng);
      } else {
        // Get the location of you
        const location = await this.map.getMyLocation();
        latlng = location.latLng;
      }

      console.log(latlng);

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: latlng,
        zoom: 15,
        duration: 5000
      });

    } catch (err) {
      console.log(err);
    }
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
