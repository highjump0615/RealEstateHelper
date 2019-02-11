import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-signup-profile',
  templateUrl: './signup-profile.page.html',
  styleUrls: ['./signup-profile.page.scss'],
})
export class SignupProfilePage implements OnInit {

  userId = '';

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
  ) {
    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
  }

  onButBack($event: MouseEvent) {
    // back to prev page
    this.navCtrl.pop();
  }
}
