import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ImageViewerComponent} from '../../components/image-viewer/image-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public modalController: ModalController
  ) { }

  async viewImage(src: string, title: string = '', description: string = '') {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imgSource: src,
        imgTitle: title,
        imgDescription: description
      },
      cssClass: 'modal-fullscreen',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }
}
