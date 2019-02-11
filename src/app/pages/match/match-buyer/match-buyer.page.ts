import { Component, OnInit } from '@angular/core';
import {AlertController, PopoverController} from "@ionic/angular";
import {RemoveButtonComponent} from "../../../components/remove-button/remove-button.component";

@Component({
  selector: 'app-match-buyer',
  templateUrl: './match-buyer.page.html',
  styleUrls: ['./match-buyer.page.scss'],
})
export class MatchBuyerPage implements OnInit {

  constructor(
    public popoverCtrl: PopoverController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  onButMore(event) {
    this.presentPopover(event);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: RemoveButtonComponent,
      componentProps: {
        parent: this
      },
      event: event,
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
            console.log('Confirm Cancel: blah');
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
