import { Component, OnInit } from '@angular/core';
import {ProfilePage} from '../profile.page';
import {AlertController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../services/api/api.service';
import {NavService} from '../../../services/nav.service';
import {AuthService} from '../../../services/auth/auth.service';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {Client} from '../../../models/client';
import {Property} from '../../../models/property';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.page.html',
  styleUrls: ['./profile-data.page.scss'],
})
export class ProfileDataPage extends ProfilePage implements OnInit {
  data: Client;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public router: Router,
    public api: ApiService,
    public nav: NavService,
    public auth: AuthService,
    public callNumber: CallNumber,
    public emailComposer: EmailComposer
  ) {
    super(alertController,
      toastController,
      route,
      router,
      api,
      nav,
      auth,
      callNumber,
      emailComposer);

    // init agent & client
    this.data = this.nav.get('data');
    this.user = this.data.agent;
  }

  ngOnInit() {

  }

}
