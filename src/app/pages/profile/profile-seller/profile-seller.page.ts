import { Component, OnInit } from '@angular/core';
import {BaseClientPage} from '../../base-client.page';
import {NavService} from '../../../services/nav.service';
import {ApiService} from '../../../services/api/api.service';
import {Property} from '../../../models/property';
import {ModalService} from '../../../services/modal/modal.service';
import {Router} from '@angular/router';
import {NavController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-profile-seller',
  templateUrl: './profile-seller.page.html',
  styleUrls: ['../profile-buyer/profile-buyer.page.scss'],
})
export class ProfileSellerPage extends BaseClientPage implements OnInit {

  property: Property = null;

  constructor(
    public nav: NavService,
    public api: ApiService,
    public modalService: ModalService,
    public router: Router,
    public navCtrl: NavController,
    public toastController: ToastController,
  ) {
    super(nav, router);
  }

  async ngOnInit() {
    if (!this.data) {
      return;
    }

    // check if property is fetched
    if (this.data.property) {
      return;
    }

    // fetch property
    try {
      this.data.property = await this.api.fetchPropertyWithId(this.data.propertyId);
    }
    catch (e) {
      if (e.name === 'notfound') {
        // show notice
        const toast = await
          this.toastController.create({
            color: 'dark',
            message: 'The property has been deleted',
            duration: 2000
          });
        toast.present();

        // go back
        this.navCtrl.pop();
      }
    }
  }

  onClickPhoto(img: any) {
    this.modalService.viewImage(
      img
    );
  }
}
