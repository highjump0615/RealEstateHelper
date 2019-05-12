import { Component, OnInit } from '@angular/core';
import {
  Environment,
  GoogleMap,
  GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, Marker, MyLocation,
  Geocoder, GeocoderRequest, ILatLng, GeocoderResult
} from '@ionic-native/google-maps';
import {NavController, Platform} from '@ionic/angular';
import {config} from '../../helpers/config';
import {PropertyService} from '../../services/property/property.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

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

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
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

    this.map.on(GoogleMapsEvent.MAP_CLICK)
      .subscribe(
        (params: any[]) => {
          // clear all markers
          this.map.clear();

          const latLng: ILatLng = params[0];
          const marker: Marker = this.map.addMarkerSync({
            'position': latLng
          });

          this.lat = latLng.lat;
          this.lng = latLng.lng;

          // Latitude, longitude -> address
          Geocoder.geocode({
            'position': latLng
          }).then((results: GeocoderResult[]) => {
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

            marker.setTitle(address);
            marker.showInfoWindow();

            this.address = address;
          });
        }
      );

  }

  async goToMyLocation() {
    this.map.clear();

    try {
      // Get the location of you
      const location = await this.map.getMyLocation();

      console.log(location);

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 15,
        duration: 5000
      });

    } catch (err) {
      console.log(err);
    }
  }

  onButDone() {
    // set data
    this.propService.address = this.address;
    this.propService.lat = this.lat;
    this.propService.lng = this.lng;

    this.navCtrl.pop();
  }
}
