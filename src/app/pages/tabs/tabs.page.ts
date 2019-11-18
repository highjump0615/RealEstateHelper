import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabService} from '../../services/tab.service';
import {ChatService} from '../../services/chat/chat.service';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  public static TAB_HOME = 'home';
  public static TAB_CHAT = 'chat';
  public static TAB_FAVOURITE = 'favourites';
  public static TAB_NOTIFICATION = 'notifications';

  unreadMsgCount = 0;

  constructor(
    private tab: TabService,
    private chat: ChatService,
    public api: ApiService,
  ) {
  }

  async ngOnInit() {
    this.chat.addFetchChat((msgs) => this.updateBadge(msgs));
  }

  ionViewDidEnter() {
    const pageCurrent = this.tab.getCurrentTab();
    if (pageCurrent) {
      pageCurrent.ionViewDidEnter();
    }
  }

  onTabWillChange(event) {
    this.tab.currentTab = event.tab;
  }

  ngOnDestroy() {
    // unload
    console.log('ionViewWillUnload tab');
    this.api.detachLatestChatList();
  }

  updateBadge(messages) {
    let nCount = 0;

    for (const m of messages) {
      nCount += m.unreadCount;
    }

    this.unreadMsgCount = nCount;
  }
}
