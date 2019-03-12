import { Component, OnInit } from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss']
})
export class MessagePage implements OnInit {

  constructor(
    private keyboard: Keyboard
  ) {
    keyboard.setResizeMode('native');
  }

  ionViewDidLeave() {
    this.keyboard.setResizeMode('');
  }

  ngOnInit() {
  }

}
