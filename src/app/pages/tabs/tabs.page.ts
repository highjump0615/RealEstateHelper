import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabService} from '../../services/tab.service';
import {ChatService} from '../../services/chat/chat.service';
import {ApiService} from '../../services/api/api.service';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  public static TAB_HOME = 'home';
  public static TAB_MATCH = 'matches';
  public static TAB_CHAT = 'chat';
  public static TAB_FAVOURITE = 'favourites';
  public static TAB_NOTIFICATION = 'notifications';

  tabHome = TabsPage.TAB_HOME;
  tabMatch = TabsPage.TAB_MATCH;
  tabChat = TabsPage.TAB_CHAT;
  tabFavourite = TabsPage.TAB_FAVOURITE;
  tabNotification = TabsPage.TAB_NOTIFICATION;

  unreadMsgCount = 0;

  constructor(
    public tab: TabService,
    private chat: ChatService,
    public api: ApiService,
    public auth: AuthService,
    public router: Router,
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

  async onTabWillChange(event) {
    const tabTo = event.tab;

    // check the user login status except the home tab
    if (tabTo === TabsPage.TAB_MATCH
      || tabTo === TabsPage.TAB_FAVOURITE
      || tabTo === TabsPage.TAB_CHAT
      || tabTo === TabsPage.TAB_NOTIFICATION) {

      if (!this.auth.user) {
        await this.router.navigate(['tabs', this.tab.currentTab]);

        // go to sign up page
        this.router.navigate(['signup-email']);
        return;
      }
    }

    this.tab.currentTab = tabTo;
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

  onButTab(tabPage) {
    // check logged in status
    if (!this.auth.user) {
      // go to login page
      this.router.navigate(['signup-email']);
      return;
    }

    // go to tab page
    this.router.navigate(['tabs', tabPage])
  }
}
