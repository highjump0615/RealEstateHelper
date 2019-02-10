import { Component, OnInit } from '@angular/core';
import {
  GoogleMap,
  GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, Marker, MyLocation
} from '@ionic-native/google-maps';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  map: GoogleMap;

  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      // camera: {
      //   target: {
      //     lat: 43.0741704,
      //     lng: -89.3809802
      //   },
      //   zoom: 18,
      //   tilt: 30
      // }
    });
    this.goToMyLocation();
  }

  goToMyLocation(){
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null ,2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      // add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: '@ionic-native/google-maps plugin!',
        snippet: 'This plugin is awesome!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        console.log('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
          console.log('Click MAP',data);
        }
      );
    })
      .catch(err => {
        // this.loading.dismiss();
        console.log(err);
      });
  }

}
