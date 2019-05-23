import { Component, OnInit } from '@angular/core';
import {AlertController, PopoverController} from '@ionic/angular';
import {RemoveButtonComponent} from '../../../components/remove-button/remove-button.component';
import {NavService} from '../../../services/nav.service';
import {Client} from '../../../models/client';

@Component({
  selector: 'app-match-buyer',
  templateUrl: './match-buyer.page.html',
  styleUrls: ['./match-buyer.page.scss'],
})
export class MatchBuyerPage implements OnInit {
  seller: Client;

  constructor(
    public nav: NavService,
    public popoverCtrl: PopoverController,
    public alertController: AlertController
  ) {
    // get parameter
    this.seller = this.nav.get('data');
  }

  ngOnInit() {
  }

  onButMore(event) {
    this.presentPopover(event);

    event.stopPropagation();
    return false;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: RemoveButtonComponent,
      componentProps: {
        parent: this
      },
      event: ev,
      translucent: true,
      cssClass: 'po-remove'
    });

    return await popover.present();
  }

  onDelete() {
    this.presentDeleteConfirm();
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this item?',
      message: 'The item will be removed permanently from matched buyers',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // close popover
            this.popoverCtrl.dismiss();
          }
        }, {
          text: 'OK',
          handler: () => {
            // close popover
            this.popoverCtrl.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
