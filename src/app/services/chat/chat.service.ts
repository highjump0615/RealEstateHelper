import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatListeners = [];
  fetchChatRef: any;

  chats = [];

  constructor(
    public api: ApiService,
  ) {
  }

  addFetchChat(updateFunc: (msgs) => void) {
    this.chatListeners.push(updateFunc);

    if (this.fetchChatRef) {
      // already fetched
      updateFunc(this.chats);

      return;
    }

    // add chat data event
    this.fetchChatRef = this.api.fetchLatestChatList(
      (msgs) => this.onUpdate(msgs)
    );
  }

  onUpdate(chats) {
    this.chats = chats;

    for (const listener of this.chatListeners) {
      listener(chats);
    }
  }
}
