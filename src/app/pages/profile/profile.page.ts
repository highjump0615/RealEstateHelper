import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId = '';

  constructor(
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
  }

}
