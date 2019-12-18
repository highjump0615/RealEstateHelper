import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-expiry1',
  templateUrl: './expiry1.page.html',
  styleUrls: ['../expiry.scss'],
})
export class Expiry1Page implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

}
