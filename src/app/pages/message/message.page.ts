import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Message} from '../../models/message';
import {Notification} from '../../models/notification';
import {User} from '../../models/user';
import {ApiService} from '../../services/api/api.service';
import {AuthService} from '../../services/auth/auth.service';
import {NavService} from '../../services/nav.service';
import {VirtualScrollerComponent} from 'ngx-virtual-scroller';
import {KeyboardService} from '../../services/keyboard/keyboard.service';
import {Platform} from '@ionic/angular';
import {BaseKeyboardPage} from '../base-keyboard.page';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss']
})
export class MessagePage extends BaseKeyboardPage implements OnInit, OnDestroy {

  @ViewChild('scroll') scrollMain: VirtualScrollerComponent;

  userTo: User;
  messages: Array<Message> = [];
  chat = null;

  message = '';
  unreadCount = 0;
  fetchChatRef: any;

  constructor(
    public keyboard: Keyboard,
    public nav: NavService,
    private auth: AuthService,
    public api: ApiService,
    public kbService: KeyboardService,
    public platform: Platform,
    private route: ActivatedRoute,
  ) {
    super(kbService, platform, keyboard);
  }

  async ngOnInit() {
    const userId = this.route.snapshot.params['id'];

    if (userId) {
      // fetch property from id
      try {
        this.userTo = await this.api.getUserWithId(userId);
      } catch (e) {
        console.log(e);
      }
    } else {
      // get parameter
      this.userTo = this.nav.get('data');
    }

    //
    // fetch messages
    //
    this.api.fetchMessageAdded(
      this.auth.user.id,
      this.userTo.id,
      (msg) => {
        // check existence
        // if (this.messages.findIndex((m) => m.id == msg.id) >= 0) {
        //   return;
        // }

        this.messages.push(msg);

        // scroll to bottom
        this.scrollMain.scrollToPosition(999999);

        this.clearUnreadCount();
      }
    );

    //
    // fetch data for unread count of the user to
    //
    this.fetchChatRef = this.api.fetchLatestChat(
      this.userTo,
      (msg) => {
        this.chat = msg;
        this.unreadCount = msg.unreadCount;

        console.log('Unread count', msg.unreadCount);
      }
    );

    // clear unread count
    this.clearUnreadCount();
  }

  ngOnDestroy() {
    console.log('destroy message page');

    this.api.detachLatestChat(this.userTo);
    this.api.detachMessageAdded(this.auth.user.id, this.userTo.id);
  }

  isMessageMine(msg) {
    return msg.senderId === this.auth.user.id;
  }

  clearUnreadCount() {
    // no chat between users
    if (!this.chat) {
      return;
    }

    this.api.saveToDatabaseRaw(
      0,
      `${Message.TABLE_NAME_CHAT}/${this.auth.user.id}/${this.userTo.id}/${Message.FIELD_UNREAD_COUNT}`
    );
  }

  onButSend() {
    // not entered anyting, return
    if (!this.message) {
      return;
    }

    const msgNew = new Message();

    msgNew.senderId = this.auth.user.id;
    msgNew.message = this.message;
    msgNew.sender = this.auth.user;

    // send message
    this.api.saveToDatabase(
      msgNew,
      null,
      `${this.auth.user.id}/${this.userTo.id}`);
    this.api.saveToDatabase(
      msgNew,
      null,
      `${this.userTo.id}/${this.auth.user.id}`);

    // add to chat list
    this.api.saveToDatabaseRaw(
      msgNew.toDictionary(),
      `${Message.TABLE_NAME_CHAT}/${this.auth.user.id}/${this.userTo.id}`);

    // add unread count for badge show
    msgNew.unreadCount = this.unreadCount + 1;
    this.api.saveToDatabaseRaw(
      msgNew.toDictionary(),
      `${Message.TABLE_NAME_CHAT}/${this.userTo.id}/${this.auth.user.id}`);

    // clear input
    this.message = '';

    //
    // send push notification
    //
    const message = {
      notification: {
        title: this.auth.user.name,
        body: this.message,
      },
      data: {
        type: Notification.NOTIFICATION_CHAT,
        userId: this.auth.user.id,
      },
    };

    this.api.sendChatNotification(this.userTo.id, message);
  }
}
