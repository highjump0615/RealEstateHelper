import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {KeyboardService} from "../../../services/keyboard.service";

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.page.html',
  styleUrls: ['./signup-email.page.scss'],
})
export class SignupEmailPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onButNext($event: MouseEvent) {
    console.log('asdf');

    this.router.navigate(['signup-password']);
  }

  onButSignin($event: MouseEvent) {
    // go to login page
    this.router.navigate(['login']);
  }
}
