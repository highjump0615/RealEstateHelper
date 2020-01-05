import { Component, OnInit } from '@angular/core';
import {Message} from '../../models/message';
import {ApiService} from '../../services/api/api.service';
import {NavService} from '../../services/nav.service';
import {TabsPage} from '../tabs/tabs.page';
import {TabService} from '../../services/tab.service';
import {AlertController} from '@ionic/angular';
import {ChatService} from '../../services/chat/chat.service';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  showLoading = true;
  messages: Array<Message> = [];

  constructor(
    public alertController: AlertController,
    public nav: NavService,
    private tab: TabService,
    public api: ApiService,
    private chat: ChatService,
    public auth: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_CHAT, this);
  }

  async ionViewDidEnter() {
    this.chat.addFetchChat((msgs) => this.updateList(msgs));
  }

  async updateList(messages) {
    const proms = [];

    for (const m of messages) {
      if (m.toUser) {
        continue;
      }

      const prom = this.api.getUserWithId(m.id)
        .then((u) => {
          m.toUser = u;
        });

      proms.push(prom);
    }

    await Promise.all(proms);

    // update list
    this.messages = messages;

    this.showLoading = false;
  }

  onItemClick(msg) {
    // available when user is fetched only
    if (!msg.toUser) {
      return;
    }

    // check premium status
    if (!this.auth.user.purchase.isPremium()) {
      this.router.navigate(['/purchase']);
      return;
    }

    this.nav.push('message', {
      data: msg.toUser
    });
  }

  itemHeightFn(item, index) {
    return 73;
  }

  async onButDelete(index, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Are you sure remove this messages?',
      message: 'The message history with this user will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

            slidingItem.close();
          }
        }, {
          text: 'OK',
          handler: () => {
            this.doDeleteChat(index);

            slidingItem.close();
          }
        }
      ]
    });

    await alert.present();
  }

  private doDeleteChat(index) {
    const msg = this.messages[index];

    this.api.deleteChat(msg.id);

    this.messages.splice(index, 1);
    this.messages = [...this.messages];
  }
}
