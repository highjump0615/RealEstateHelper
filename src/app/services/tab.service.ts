import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  currentTab = '';
  tabPages = [];

  constructor() { }

  setCurrentTab(name, page) {
    this.tabPages[name] = page;
  }

  getCurrentTab() {
    return this.tabPages[this.currentTab];
  }
}
