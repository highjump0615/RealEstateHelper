import {Component, OnInit, ViewChild} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Message} from '../../models/message';
import {User} from '../../models/user';
import {ApiService} from '../../services/api/api.service';
import {AuthService} from '../../services/auth/auth.service';
import {NavService} from '../../services/nav.service';
import {VirtualScrollerComponent} from 'ngx-virtual-scroller';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss']
})
export class MessagePage implements OnInit {

  @ViewChild('scroll') scrollMain: VirtualScrollerComponent;

  userTo: User;
  messages: Array<Message> = [];

  message = '';

  constructor(
    private keyboard: Keyboard,
    public nav: NavService,
    private auth: AuthService,
    public api: ApiService
  ) {
    keyboard.setResizeMode('native');

    // get parameter
    this.userTo = this.nav.get('data');
  }

  ionViewDidLeave() {
    this.keyboard.setResizeMode('');
  }

  ngOnInit() {
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
      }
    );
  }

  isMessageMine(msg) {
    return msg.senderId === this.auth.user.id;
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
    this.api.saveToDatabaseRaw(
      msgNew.toDictionary(),
      `${Message.TABLE_NAME_CHAT}/${this.userTo.id}/${this.auth.user.id}`);

    // clear input
    this.message = '';

    //
    // send push notification
    //
  }
}
