import { Component, OnInit } from '@angular/core';
import {BaseKeyboardPage} from '../base-keyboard.page';
import {KeyboardService} from '../../services/keyboard/keyboard.service';
import {Platform} from '@ionic/angular';
import {Keyboard} from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage extends BaseKeyboardPage implements OnInit {

  constructor(
    public kbService: KeyboardService,
    public platform: Platform,
    public keyboard: Keyboard,
  ) {
    super(kbService, platform, keyboard);
  }

  ngOnInit() {
  }

  onButDone() {
  }

}
