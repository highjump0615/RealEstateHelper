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
import {PropertyHelper} from "../../../helpers/property-helper";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.page.html',
  styleUrls: ['./profile-data.page.scss'],
})
export class ProfileDataPage extends ProfilePage implements OnInit {
  data: Client;
  propHelper: PropertyHelper;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public router: Router,
    public api: ApiService,
    public nav: NavService,
    public auth: AuthService,
    public callNumber: CallNumber,
    public emailComposer: EmailComposer,
    private socialSharing: SocialSharing,
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

    // init user
    this.user = this.data.agent;

    this.propHelper = new PropertyHelper().init(socialSharing);
  }

  async ngOnInit() {
    console.log(this.user);

    // fetch agent info
    if (!this.data.agent) {
      // agent is me
      if (this.data.agentId === this.auth.user.id) {
        this.data.agent = this.auth.user;
      }
      else {
        this.data.agent = await this.api.getUserWithId(this.data.agentId);
      }

      this.user = this.data.agent;
    }
  }

  onButShare() {
    this.propHelper.shareProperty(this.data.propertyId, this.auth.user);
  }

}
