import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {NavService} from '../../../services/nav.service';
import {Client} from '../../../models/client';

@Component({
  selector: 'app-match-property',
  templateUrl: './match-property.page.html',
  styleUrls: ['./match-property.page.scss'],
})
export class MatchPropertyPage implements OnInit {
  buyer: Client;

  constructor(
    public alertController: AlertController,
    public nav: NavService,
    private router: Router
  ) {
    // get parameter
    this.buyer = this.nav.get('data');
  }

  ngOnInit() {
  }

  onButDelete(event) {
    this.presentDeleteConfirm();

    event.stopPropagation();
    return false;
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this item?',
      message: 'The item will be removed permanently from matched properties',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  onProperty(prop, event) {
    // go to property page
    this.nav.push('property', {
      data: prop
    });

    event.stopPropagation();
    return false;
  }

  goToLocation(prop, event) {
    this.router.navigate(['/location', {
      location: prop.location
    }]);

    event.stopPropagation();
    return false;
  }
}
