import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/user';
import {OnboardPage} from '../../pages/onboard/onboard.page';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  static KEY_USER = 'current_user';

  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: Storage
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // check authentication state
    if (!this.auth.user) {
      return this.storage.get(AuthGuard.KEY_USER)
        .then((val) => {
          if (val) {
            this.auth.user = new User().deserialize(val);

            return Promise.resolve(true);
          }

          return this.showOnboard();
        })
        .catch((err) => {
          console.log(err);

          return this.showOnboard();
        });
    }
  }

  showOnboard() {
    //
    // check onboard shown status
    //
    return this.storage.get(OnboardPage.KEY_SHOWN)
      .then((shown) => {
        if (shown) {
          this.router.navigate(['onboard']);
        }

        this.router.navigate(['signup-email']);
        return Promise.resolve(false);
      })
      .catch((err) => {
        console.log(err);

        this.router.navigate(['signup-email']);
        return Promise.resolve(false);
      });
  }
}
