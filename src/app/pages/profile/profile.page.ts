import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId = '';
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId) {
      // fetch user
    } else {
      // me
      this.user = this.auth.user;
    }
  }

  ngOnInit() {
  }

  onButEdit() {
    this.router.navigate(['signup-profile', this.auth.user.id]);
  }
}
