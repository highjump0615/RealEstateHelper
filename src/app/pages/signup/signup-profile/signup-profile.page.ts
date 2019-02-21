import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {KeyboardService} from '../../../services/keyboard.service';

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
    private router: Router,
    private kbService: KeyboardService
  ) {
    this.userId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
  }

  onButBack($event: MouseEvent) {
    // back to prev page
    this.navCtrl.pop();
  }

  onButNext($event: MouseEvent) {
    if (this.userId) {
      // update profile
    } else {
      // sign up
      this.router.navigate(['home']);
    }
  }
}
