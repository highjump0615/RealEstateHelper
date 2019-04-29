import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
  }

  onButEdit() {
    this.router.navigate(['signup-profile', 'asdf']);
  }

  onButChat() {
    this.router.navigate(['message']);
  }
}
