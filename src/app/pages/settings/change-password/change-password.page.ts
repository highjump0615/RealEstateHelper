import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  passwordCurrent = '';
  passwordNew = '';
  rePassword: string;

  constructor() { }

  ngOnInit() {
  }

  isMatchPassword() {
    if (!this.passwordNew) {
      return false;
    }

    return this.passwordNew === this.rePassword;
  }

}
