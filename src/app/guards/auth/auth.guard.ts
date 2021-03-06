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

  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: Storage,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log('auth guard');

    const needUser = next.data['needUser'];

    // default is require onboard
    const needOnboard = next.data['needOnboard'];

    // check authentication state
    if (!this.auth.user) {
      return this.storage.get(AuthService.KEY_USER)
        .then((val) => {
          if (val) {
            // current user existing
            this.auth.user = new User().deserialize(val);

            return this.gotoNext(needOnboard, needUser, state);
          }

          // no user
          return this.gotoNext(needOnboard, needUser, state);
        })
        .catch((err) => {
          console.log(err);

          // no user
          return this.gotoNext(needOnboard, needUser, state);
        });
    }

    // user existing
    return this.gotoNext(needOnboard, needUser, state);
  }

  async gotoNext(needOnboard, needUser, state): Promise<boolean> {

    if (this.auth.user && this.auth.user.saved) {
      //
      // some pages are available in both logged in and not-logged in state
      // so pass through for undefined case
      //
      if (needUser == undefined || needUser == true) {
        return Promise.resolve(true);
      }

      // user is existing, redirect to main page
      this.router.navigate(['/tabs/home']);
      return Promise.resolve(false);

    } else {
      //
      // check onboard shown status
      //
      let shownOnboard = false;
      try {
        shownOnboard = await this.storage.get(OnboardPage.KEY_SHOWN);
      }
      catch (e) {
        console.log(e);
      }

      if (needOnboard == undefined || needUser == true) {
        if (!shownOnboard) {
          // user is not existing, redirect to sign up page
          this.router.navigate(['onboard']);
          return Promise.resolve(false);
        }
      }

      if (!needUser) {
        return Promise.resolve(true);
      }

      // user is not existing, redirect to sign up page
      this.router.navigate(['signup-email'], {
        queryParams: { returnUrl: state.url }
      });

      return Promise.resolve(false);
    }
  }
}
