import { Component, OnInit } from '@angular/core';
import {NavService} from '../../services/nav.service';
import {Property} from '../../models/property';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {NavController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
})
export class PropertyPage implements OnInit {

  data: Property;

  constructor(
    public nav: NavService,
    public navCtrl: NavController,
    public router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public toastController: ToastController,
  ) {
  }

  async ngOnInit() {
    const propId = this.route.snapshot.params['id'];

    if (propId) {
      // fetch property from id
      try {
        this.data = await this.api.fetchPropertyWithId(propId);
      } catch (e) {
        console.log(e);

        if (e.name === 'notfound') {
          // show notice
          const toast = await this.toastController.create({
            color: 'dark',
            message: 'The property has been deleted',
            duration: 2000
          });
          toast.present();

          // go back
          this.navCtrl.pop();
        }
      }

    } else {
      // get parameter
      this.data = this.nav.get('data');
    }
  }

  onButFavourite() {
    this.nav.push('select-buyer', {
      data: this.data
    });
  }

  goToLocation(prop, event) {
    this.router.navigate(['/location', {
      location: prop.location
    }]);

    event.stopPropagation();
    return false;
  }
}
