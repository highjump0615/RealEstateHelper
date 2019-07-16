import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {NavService} from '../../../services/nav.service';

@Component({
  selector: 'app-expiry2',
  templateUrl: './expiry2.page.html',
  styleUrls: ['../expiry.scss'],
})
export class Expiry2Page implements OnInit {

  constructor(
    public nav: NavService,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  onButAdd() {
    this.nav.push('/profile-add');
  }
}
