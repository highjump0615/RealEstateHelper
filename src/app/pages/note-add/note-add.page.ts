import { Component, OnInit } from '@angular/core';
import {NavService} from '../../services/nav.service';
import {Client} from '../../models/client';
import {ApiService} from '../../services/api/api.service';
import {BasePage} from '../base.page';
import {LoadingController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.page.html',
  styleUrls: ['./note-add.page.scss'],
})
export class NoteAddPage extends BasePage implements OnInit {
  note = '';
  client: Client;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public nav: NavService,
    public api: ApiService
  ) {
    super(loadingCtrl);

    // get parameter
    this.client = this.nav.get('data');
  }

  async ngOnInit() {
    if (!this.client) {
      return;
    }

    // fetch note
    this.note = await this.api.fetchClientNote(this.client);
  }

  async onButSave() {
    // check if text is empty
    if (!this.note) {
      return;
    }

    this.client.note = this.note;

    await this.showLoadingView();

    try {
      await this.api.saveClientNote(this.client);

      // back to prev page
      this.navCtrl.pop();
    } catch (err) {
      console.log(err);
    } finally {
      this.showLoadingView(false);
    }
  }
}
