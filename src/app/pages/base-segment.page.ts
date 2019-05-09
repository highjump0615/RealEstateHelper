import {BasePage} from './base.page';
import {AlertController, LoadingController} from '@ionic/angular';

export class BaseSegmentPage extends BasePage {

  PAGE_BUYER = 0;
  PAGE_SELLER = 1;

  currentPage = this.PAGE_BUYER;

  constructor(
    public loadingCtrl?: LoadingController,
    public alertCtrl?: AlertController,
  ) {
    super(loadingCtrl, alertCtrl);
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
