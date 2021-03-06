import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Notification} from '../../models/notification';
import {ApiService} from '../../services/api/api.service';
import * as moment from 'moment';
import {Client} from '../../models/client';
import {Router} from '@angular/router';
import {NavService} from '../../services/nav.service';
import {BaseModel} from '../../models/base-model';
import {AuthService} from '../../services/auth/auth.service';
import {AlertController, Platform, ToastController} from '@ionic/angular';
import {FirebaseManager} from '../../helpers/firebase-manager';
import {Property} from '../../models/property';
import {Message} from '../../models/message';
import {User} from "../../models/user";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, AfterViewInit {
  static PAGE_COUNT = 16;

  showLoading = true;

  private notiAll: Array<Notification> = [];
  notifications: Array<Notification> = [];

  NOTIFICATION_MATCH_BUYER = Notification.NOTIFICATION_MATCH_BUYER;
  NOTIFICATION_MATCH_PROPERTY = Notification.NOTIFICATION_MATCH_PROPERTY;
  NOTIFICATION_EXPIRE_PROPERTY = Notification.NOTIFICATION_EXPIRE_PROPERTY;
  NOTIFICATION_EXPIRE_BUYER = Notification.NOTIFICATION_EXPIRE_BUYER;
  NOTIFICATION_REMOVE_PROPERTY = Notification.NOTIFICATION_REMOVE_PROPERTY;
  NOTIFICATION_REMOVE_BUYER = Notification.NOTIFICATION_REMOVE_BUYER;

  isEdit = false;
  itemWidth = 0;

  isSelectAll = false;

  constructor(
    public api: ApiService,
    private router: Router,
    public nav: NavService,
    private auth: AuthService,
    public toastController: ToastController,
    public alertController: AlertController,
    public platform: Platform,
  ) {
  }

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.itemWidth = this.platform.width() - 14 - 14;
    });
  }

  async fetchData() {
    if (!this.auth.user) {
      return;
    }

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

    this.showLoading = false;
  }

  private async filterData(continued = false) {
    try {
      const notiTemp = [];
      const proms = [];

      let idxStart = 0;
      if (continued) {
        idxStart = this.notifications.length;
      }

      for (let i = idxStart; i < this.notiAll.length; i++) {
        const n = this.notiAll[i];

        if (n.type === Notification.NOTIFICATION_MATCH_BUYER ||
          n.type === Notification.NOTIFICATION_MATCH_PROPERTY ||
          n.type === Notification.NOTIFICATION_EXPIRE_BUYER) {
          // fetch data
          const prom = this.api.fetchClientWithId(n.clientId, true)
            .then((c) => {
              n.client = c;
            })
            .catch((e) => {
            });

          proms.push(prom);
        }
        else {
          // property expire, dummy data in client
          n.client = new Client();
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
    let clientName = '';
    const clientCode = Client.getCodeReadable(noti.clientId);
    const propCode = Property.getCodeReadable(noti.propertyId);
    const sellerCode = `S${Client.getCodeReadable(noti.sellerId)}`;

    if (noti.client) {
      clientName = `${noti.client.name} (B${clientCode})`;
    }
    else {
      clientName = `B${clientCode}`;
    }

    if (noti.type === Notification.NOTIFICATION_MATCH_BUYER) {
      strDesc = `New property ${propCode} has matched to your buyer ${clientName}`;
      if (sellerCode) {
        strDesc = `New seller ${sellerCode} has matched to your buyer ${clientName}`;
      }
    }
    else if (noti.type === Notification.NOTIFICATION_MATCH_PROPERTY) {
      strDesc = `New buyer ${clientName} has matched to your property ${propCode}`;
      if (sellerCode) {
        strDesc = `New buyer ${clientName} has matched to your seller ${sellerCode}`;
      }
    }
    else if (noti.type === Notification.NOTIFICATION_EXPIRE_PROPERTY) {
      strDesc = `Your property ${propCode} has been listed for 90 days. If you don’t reply the listing will be deleted in 5 days.`;
      if (sellerCode) {
        strDesc = `Your seller ${sellerCode} has been listed for 90 days. If you don’t reply the listing will be deleted in 5 days.`;
      }
    }
    else if (noti.type === Notification.NOTIFICATION_EXPIRE_BUYER) {
      strDesc = `Your buyer ${clientName} has been listed for 90 days. If you don’t reply the listing will be deleted in 5 days.`;
    }
    else if (noti.type === Notification.NOTIFICATION_REMOVE_PROPERTY) {
      strDesc = `Your property ${propCode} has been deleted automatically`;
      if (sellerCode) {
        strDesc = `Your seller ${sellerCode} has been deleted automatically`;
      }
    }
    else if (noti.type === Notification.NOTIFICATION_REMOVE_BUYER) {
      strDesc = `Your buyer ${clientName} has been deleted automatically`;
    }

    return strDesc;
  }

  getTimeFormatted(noti) {
    const time = moment(noti.createdAt);
    return time.format('MMM DD | hh:mm A');
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
    if (nt.type === Notification.NOTIFICATION_MATCH_BUYER ||
      nt.type === Notification.NOTIFICATION_EXPIRE_PROPERTY) {
      // go to property page
      this.router.navigate(['/property', nt.propertyId]);
    }
    else if (nt.type === Notification.NOTIFICATION_MATCH_PROPERTY ||
      nt.type === Notification.NOTIFICATION_EXPIRE_BUYER) {

      if (!nt.client) {
        this.showNotice('The buyer has been deleted');
        return;
      }

      // go to buyer page
      if (nt.type === Notification.NOTIFICATION_MATCH_PROPERTY) {
        this.nav.push('profile-data', {
          data: nt.client
        });
      }
      else {
        this.nav.push('profile-buyer', {
          data: nt.client
        });
      }
    }

    if (!nt.isRead) {
      //
      // set read status of notification
      //
      nt.isRead = true;

      // save to db
      this.api.saveToDatabaseWithField(
        nt,
        Notification.FIELD_IS_READ,
        true,
        null,
        this.auth.user.id
      );

      //
      // update unread notification count of the user
      //
      this.decreaseUnreadNotification();
    }
  }

  decreaseUnreadNotification() {
    this.auth.user.decreaseUnreadNotification();
    this.auth.updateCurrentUser();
    this.api.saveToDatabaseWithField(
      this.auth.user,
      User.FIELD_UNREAD_NOTIFICATION,
      this.auth.user.unreadNotificationCount
    );
  }

  async onButContinue(nt: Notification, slidingItem) {
    const timeCurrent = FirebaseManager.getInstance().getServerLongTime();
    let strMsg = '';

    // property continue
    if (nt.type === Notification.NOTIFICATION_EXPIRE_PROPERTY) {
      // update updatedAt of the property
      this.api.saveToDatabaseRaw(
        timeCurrent,
        `${Property.TABLE_NAME}/${nt.propertyId}/${BaseModel.FIELD_DATE_UPDATE}`
      );

      // remove expiredAt field
      this.api.saveToDatabaseRaw(
        null,
        `${Property.TABLE_NAME}/${nt.propertyId}/${Property.FIELD_DATE_EXPIRED}`
      );

      strMsg = 'Continued the property successfully';
    }
    // buyer continue
    else {
      // update updatedAt of the buyer
      this.api.saveToDatabaseRaw(
        timeCurrent,
        `${Client.TABLE_NAME_BUYER}/${nt.clientId}/${BaseModel.FIELD_DATE_UPDATE}`
      );

      // remove expiredAt field
      this.api.saveToDatabaseRaw(
        null,
        `${Client.TABLE_NAME_BUYER}/${nt.clientId}/${Client.FIELD_DATE_EXPIRED}`
      );

      strMsg = 'Continued the buyer successfully';
    }

    this.setUpdateNotifiation(nt);

    // show notice
    this.showNotice(strMsg);
    slidingItem.close();
  }

  setUpdateNotifiation(nt) {
    // update updatedAt of the notification
    nt.updateTime();
    this.api.saveToDatabase(nt, nt.id, this.auth.user.id);
  }

  async onButDeleteBuyer(nt: Notification, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Are you sure delete this buyer?',
      message: 'The client info will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'OK',
          handler: () => {
            this.doDeleteBuyer(nt.client, slidingItem);
            nt.client = null;

            this.setUpdateNotifiation(nt);
          }
        }
      ]
    });

    await alert.present();
  }

  doDeleteBuyer(buyer, slidingItem) {
    const dbRef = FirebaseManager.ref();
    const query = dbRef.child(Client.TABLE_NAME_BUYER).child(buyer.id);

    query.remove();

    this.showNotice(`Buyer ${buyer.name} has been deleted`);
    slidingItem.close();
  }

  async onButDeleteProp(nt: Notification, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Are you sure delete this property?',
      message: 'The property info will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'OK',
          handler: () => {
            this.doDeleteProperty(nt.propertyId, slidingItem);

            this.setUpdateNotifiation(nt);
          }
        }
      ]
    });

    await alert.present();
  }

  async doDeleteProperty(propId, slidingItem) {
    // fetch user
    const prop = await this.api.fetchPropertyWithId(propId);

    // delete property
    const dbRef = FirebaseManager.ref();
    let query = dbRef.child(Property.TABLE_NAME).child(prop.id);
    query.remove();

    // delete seller
    query = dbRef.child(Client.TABLE_NAME_SELLER).child(prop.sellerId);
    query.remove();

    this.showNotice(`The property has been deleted`);
    slidingItem.close();
  }

  async showNotice(text) {
    // show notice
    const toast = await this.toastController.create({
      color: 'dark',
      message: text,
      duration: 2000
    });
    toast.present();
  }

  async onButDelete(index, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this notification?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'OK',
          handler: () => {
            this.doDeleteNotification(index, slidingItem);
          }
        }
      ]
    });

    await alert.present();
  }

  doDeleteNotification(index, slidingItem) {
    const n = this.notifications[index];
    if (!n.isRead) {
      // not read, decrease unread notification
      this.decreaseUnreadNotification();
    }

    const query = n.getDatabaseRef(null, this.auth.user.id);
    query.remove();

    // remove item from list
    this.notifications.splice(index, 1);
    this.notiAll.splice(index, 1);

    slidingItem.close();
  }

  onItemLongPress() {
    this.isEdit = true;
  }

  onButCancel() {
    //
    // deselect all
    //
    for (const nt of this.notiAll) {
      nt.selected = false;
    }
    for (const nt of this.notifications) {
      nt.selected = false;
    }
    this.isSelectAll = false;

    this.isEdit = false;
  }

  onSelectAll() {
    // select / deselect all
    for (let n of this.notifications) {
      n.selected = this.isSelectAll;
    }
  }

  async onButDeleteAll() {
    for (let n of this.notifications) {
      if (n.selected) {
        const alert = await this.alertController.create({
          header: 'Are you sure you want to delete these notifications?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
              }
            }, {
              text: 'OK',
              handler: () => {
                this.doDeleteNotifications();
              }
            }
          ]
        });

        await alert.present();

        break;
      }
    }
  }

  private doDeleteNotifications() {
    for (let i = this.notifications.length - 1; i >= 0; i--) {
      const nt = this.notifications[i];

      if (nt.selected) {
        const query = nt.getDatabaseRef(null, this.auth.user.id);
        query.remove();

        // remove item from list
        this.notifications.splice(i, 1);
        this.notiAll.splice(i, 1);
      }
    }
  }
}
