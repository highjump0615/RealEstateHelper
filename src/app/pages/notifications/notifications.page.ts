import { Component, OnInit } from '@angular/core';
import {Notification} from '../../models/notification';
import {ApiService} from '../../services/api/api.service';
import * as moment from 'moment';
import {Client} from '../../models/client';
import {Router} from '@angular/router';
import {NavService} from '../../services/nav.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  static PAGE_COUNT = 16;

  showLoading = true;

  private notiAll: Array<Notification> = [];
  notifications: Array<Notification> = [];

  NOTIFICATION_MATCH_BUYER = Notification.NOTIFICATION_MATCH_BUYER;
  NOTIFICATION_MATCH_PROPERTY = Notification.NOTIFICATION_MATCH_PROPERTY;
  NOTIFICATION_EXPIRE = Notification.NOTIFICATION_EXPIRE;


  constructor(
    public api: ApiService,
    private router: Router,
    public nav: NavService,
  ) {
  }

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    console.log('fetch start');

    try {
      // fetch all notifications
      this.notiAll = await this.api.getAllNotifications();

      // sort by time
      this.notiAll.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);

      await this.filterData();

    } catch (err) {
      console.log(err);
    }
  }

  private async filterData(continued = false) {
    try {
      const notiTemp = [];
      const proms = [];

      for (const n of this.notiAll) {
        if (n.isFetched()) {
          continue;
        }

        if (n.type === Notification.NOTIFICATION_MATCH_BUYER ||
          n.type === Notification.NOTIFICATION_MATCH_PROPERTY) {
          // fetch data
          const prom = this.api.fetchClientWithId(n.clientId, true)
            .then((c) => {
              n.client = c;
            });

          proms.push(prom);
        }

        notiTemp.push(n);

        if (notiTemp.length >= NotificationsPage.PAGE_COUNT) {
          break;
        }
      }

      await Promise.all(proms);
      console.log(notiTemp);

      // clear data if it is refresh
      if (!continued) {
        this.notifications = [];
      }
      this.notifications = this.notifications.concat(notiTemp);
    }
    finally {
      // hide loading mask
      this.showLoading = false;
    }
  }


  async doRefresh(event) {
    await this.fetchData();

    event.target.complete();
  }

  getNotificationDesc(noti) {
    let strDesc = '';

    if (noti.type === Notification.NOTIFICATION_MATCH_BUYER) {
      strDesc = `New Property has matched to your buyer ${noti.client.name}`;
    }
    else if (noti.type === Notification.NOTIFICATION_MATCH_PROPERTY) {
      strDesc = `New buyer has matched to your property`;
    }

    return strDesc;
  }

  getTimeFormatted(noti) {
    const time = moment(noti.createdAt);
    return time.format('MMM dd | hh:mm A');
  }

  async loadMoreData(event) {
    await this.filterData(true);

    event.target.complete();

    // check if all loaded
    if (this.notifications.length >= this.notiAll.length) {
      event.target.disabled = true;
    }
  }

  onItemClick(nt: Notification) {
    if (nt.type === Notification.NOTIFICATION_MATCH_BUYER) {
      // go to property page
      this.router.navigate(['/property', nt.propertyId]);
    }
    else if (nt.type === Notification.NOTIFICATION_MATCH_PROPERTY) {
      // go to buyer page
      this.nav.push('profile-data', {
        data: nt.client
      });
    }
  }
}
