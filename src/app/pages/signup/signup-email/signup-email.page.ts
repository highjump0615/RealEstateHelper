import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Utils} from '../../../helpers/utils';
import {ApiService} from '../../../services/api/api.service';

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.page.html',
  styleUrls: ['./signup-email.page.scss'],
})
export class SignupEmailPage implements OnInit {

  email = '';
  isExisting = true;

  constructor(
    private router: Router,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  onButNext($event: MouseEvent) {
    this.router.navigate(['signup-password', {
      email: this.email
    }]);
  }

  onButSignin($event: MouseEvent) {
    // go to login page
    this.router.navigate(['login']);
  }

  onChangeEmail() {
    this.isExisting = true;

    if (this.isValid()) {
      // check email existence
      this.api.checkUserExistingByEmail(this.email)
        .then((existing) => {
          this.isExisting = existing;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  isValid() {
    return Utils.isEmailValid(this.email);
  }
}
