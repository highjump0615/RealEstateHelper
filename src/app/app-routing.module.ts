import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule'
  },
  {
    path: 'onboard',
    loadChildren: './pages/onboard/onboard.module#OnboardPageModule'
  },
  {
    path: 'signup-email',
    loadChildren: './pages/signup/signup-email/signup-email.module#SignupEmailPageModule'
  },
  {
    path: 'signup-password',
    loadChildren: './pages/signup/signup-password/signup-password.module#SignupPasswordPageModule'
  },
  {
    path: 'signup-profile',
    loadChildren: './pages/signup/signup-profile/signup-profile.module#SignupProfilePageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'forget',
    loadChildren: './pages/forget/forget.module#ForgetPageModule'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'chat',
    loadChildren: './pages/chat/chat.module#ChatPageModule'
  },
  {
    path: 'favourites',
    loadChildren: './pages/favourites/favourites.module#FavouritesPageModule'
  },
  {
    path: 'matches',
    loadChildren: './pages/matches/matches.module#MatchesPageModule'
  },
  {
    path: 'notifications',
    loadChildren: './pages/notifications/notifications.module#NotificationsPageModule'
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule'
  },
  {
    path: 'profile-client',
    loadChildren: './pages/profile-client/profile-client.module#ProfileClientPageModule'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
