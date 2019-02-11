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
    path: 'profile/:id',
    loadChildren: './pages/profile/profile.module#ProfilePageModule'
  },
  {
    path: 'profile-client',
    loadChildren: './pages/profile-client/profile-client.module#ProfileClientPageModule'
  },
  {
    path: 'expiry1',
    loadChildren: './pages/expiry/expiry1/expiry1.module#Expiry1PageModule'
  },
  {
    path: 'expiry2',
    loadChildren: './pages/expiry/expiry2/expiry2.module#Expiry2PageModule'
  },
  {
    path: 'profile-add',
    loadChildren: './pages/profile-add/profile-add.module#ProfileAddPageModule'
  },
  {
    path: 'filter-search',
    loadChildren: './pages/filter-search/filter-search.module#FilterSearchPageModule'
  },
  {
    path: 'location',
    loadChildren: './pages/location/location.module#LocationPageModule'
  },
  {
    path: 'property',
    loadChildren: './pages/property/property.module#PropertyPageModule'
  },
  {
    path: 'share',
    loadChildren: './pages/share/share.module#SharePageModule'
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  },
  {
    path: 'feedback',
    loadChildren: './pages/feedback/feedback.module#FeedbackPageModule'
  },
  {
    path: 'about',
    loadChildren: './pages/about/about.module#AboutPageModule'
  },
  {
    path: 'subscribe',
    loadChildren: './pages/subscription/subscription.module#SubscriptionPageModule'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
