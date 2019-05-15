import { Component } from '@angular/core';
import {TabService} from '../../services/tab.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public static TAB_HOME = 'home';
  public static TAB_CHAT = 'chat';

  constructor(
    private tab: TabService
  ) {
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
}
