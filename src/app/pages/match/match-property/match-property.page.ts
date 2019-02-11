import { Component, OnInit } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-match-property',
  templateUrl: './match-property.page.html',
  styleUrls: ['./match-property.page.scss'],
})
export class MatchPropertyPage implements OnInit {

  constructor(
    public alertController: AlertController,
    private router: Router
  ) { }

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

  onProperty(event) {
    this.router.navigate(['/property']);

    event.stopPropagation();
    return false;
  }

  goToLocation(event) {
    this.router.navigate(['/location']);

    event.stopPropagation();
    return false;
  }
}
