import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Utils} from '../../../helpers/utils';

@Component({
  selector: 'app-signup-password',
  templateUrl: './signup-password.page.html',
  styleUrls: ['./signup-password.page.scss'],
})
export class SignupPasswordPage implements OnInit {

  email = '';
  password = '';
  rePassword: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  onButDone($event: MouseEvent) {
    this.router.navigate(['signup-profile', {
      email: this.email,
      password: this.password
    }]);
  }

  isOver6() {
    return this.password.length >= 6;
  }
  isContainLetter() {
    return Utils.stringContainLetter(this.password);
  }
  isContainNumber() {
    return Utils.stringContainNumber(this.password);
  }

  isMatchPassword() {
    return this.password === this.rePassword;
  }
}
