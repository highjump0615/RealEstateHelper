import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-expiry2',
  templateUrl: './expiry2.page.html',
  styleUrls: ['../expiry.scss'],
})
export class Expiry2Page implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

}
