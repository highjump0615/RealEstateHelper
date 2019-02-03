import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-password',
  templateUrl: './signup-password.page.html',
  styleUrls: ['./signup-password.page.scss'],
})
export class SignupPasswordPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onButDone($event: MouseEvent) {
  }
}
