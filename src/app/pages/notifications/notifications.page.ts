import { Component, OnInit } from '@angular/core';
import {Notification} from '../../models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Array<Notification> = [];

  constructor() {
    for (let i = 0; i < 6; i++) {
      let n = new Notification();
      n.type = i % 3;
      this.notifications.push(n);
    }
  }

  ngOnInit() {
  }

}
