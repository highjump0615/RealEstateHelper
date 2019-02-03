import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.page.html',
  styleUrls: ['./signup-email.page.scss'],
})
export class SignupEmailPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onButNext($event: MouseEvent) {
    this.router.navigate(['signup-password']);
  }
}
