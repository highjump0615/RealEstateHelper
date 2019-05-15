import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {ApiService} from '../../services/api/api.service';
import {NavService} from '../../services/nav.service';

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
    public api: ApiService,
    public nav: NavService,
    private auth: AuthService
  ) {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId) {
      // fetch user
      this.api.getUserWithId(this.userId)
        .then((user) => {
          this.user = user;
        });
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

  onButChat() {
    // only available for other user
    if (!this.userId) {
      return;
    }

    // only available after user is fetched
    if (!this.user) {
      return;
    }

    this.nav.push('message', {
      data: this.user
    });
  }
}
