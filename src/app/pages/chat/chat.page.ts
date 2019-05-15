import { Component, OnInit } from '@angular/core';
import {Message} from '../../models/message';
import {ApiService} from '../../services/api/api.service';
import {NavService} from '../../services/nav.service';
import {TabsPage} from "../tabs/tabs.page";
import {TabService} from "../../services/tab.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  showLoading = true;
  messages: Array<Message> = [];

  constructor(
    public nav: NavService,
    private tab: TabService,
    public api: ApiService
  ) { }

  ngOnInit() {
    // set tab data
    this.tab.setCurrentTab(TabsPage.TAB_CHAT, this);
  }

  async ionViewDidEnter() {
    // fetch chat list
    try {
      this.messages = await this.api.fetchChatList();

      this.fetchUsers();
    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading = false;
    }
  }

  onItemClick(msg) {
    // available when user is fetched only
    if (!msg.toUser) {
      return;
    }

    this.nav.push('message', {
      data: msg.toUser
    });
  }


  private fetchUsers() {
    for (const m of this.messages) {
      this.api.getUserWithId(m.id)
        .then((u) => {
          m.toUser = u;
        });
    }
  }

  itemHeightFn(item, index) {
    return 73;
  }
}
