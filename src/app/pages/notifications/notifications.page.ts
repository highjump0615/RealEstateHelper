import { Component, OnInit } from '@angular/core';
import {Notification} from '../../models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  showLoading = false;

  notifications: Array<Notification> = [];

  constructor() {
  }

  ngOnInit() {
  }

}
