import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from '../base-segment.page';
import {AlertController} from '@ionic/angular';
import {ApiService} from '../../services/api/api.service';
import {AuthService} from '../../services/auth/auth.service';
import {Client} from '../../models/client';
import {TabsPage} from '../tabs/tabs.page';
import {TabService} from '../../services/tab.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage extends BaseSegmentPage implements OnInit {

  showLoading = false;
  buyers: Array<Client>;
  sellers: Array<Client>;

  constructor(
    public alertController: AlertController,
    private auth: AuthService,
    private tab: TabService,
    public api: ApiService,
  ) {
    super();
  }

  ngOnInit() {
    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_FAVOURITE, this);
  }

  ionViewDidEnter() {
    this.fetchData();
  }

  onPageChanged(page: number) {
    console.log('onPageChanged');

    super.onPageChanged(page);

    this.fetchData();
  }

  async fetchData() {
    const isBuyer = this.currentPage === this.PAGE_BUYER;

    try {
      if (isBuyer) {
        if (!this.buyers) {
          this.showLoading = true;
        }

        this.buyers = await this.api.fetchFavouriteBuyers();
      } else {
        if (!this.sellers) {
          this.showLoading = true;
        }

        this.sellers = await this.api.fetchFavouriteSellers();
      }

      this.showLoading = false;

      console.log(this.buyers);

    } catch (err) {
      console.log(err);

      this.showLoading = false;
    }
  }

  onButDelete(event) {
    this.presentDeleteConfirm();

    event.stopPropagation();
    return false;
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this item?',
      message: 'The item will be removed permanently from favourites',
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

  itemHeightFn(item, index) {
    return 69;
  }
}
