import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {TabsPage} from './pages/tabs/tabs.page';
import {AuthGuard} from './guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsPage,
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'onboard',
    loadChildren: './pages/onboard/onboard.module#OnboardPageModule'
  },
  {
    path: 'signup-email',
    loadChildren: './pages/signup/signup-email/signup-email.module#SignupEmailPageModule',
    data: {needUser: false},
    canActivate: [AuthGuard]
  },
  {
    path: 'signup-password',
    loadChildren: './pages/signup/signup-password/signup-password.module#SignupPasswordPageModule',
    data: {needUser: false},
    canActivate: [AuthGuard]
  },
  {
    path: 'signup-profile',
    loadChildren: './pages/signup/signup-profile/signup-profile.module#SignupProfilePageModule',
    data: {needUser: false},
    canActivate: [AuthGuard]
  },
  {
    path: 'signup-profile/:id',
    loadChildren: './pages/signup/signup-profile/signup-profile.module#SignupProfilePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
  },
  {
    path: 'forget',
    loadChildren: './pages/forget/forget.module#ForgetPageModule',
    data: {needUser: false},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-data',
    loadChildren: './pages/profile/profile-data/profile-data.module#ProfileDataPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-client',
    loadChildren: './pages/profile/profile-client/profile-client.module#ProfileClientPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'expiry1',
    loadChildren: './pages/expiry/expiry1/expiry1.module#Expiry1PageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'expiry2',
    loadChildren: './pages/expiry/expiry2/expiry2.module#Expiry2PageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-add',
    loadChildren: './pages/profile/profile-add/profile-add.module#ProfileAddPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'filter-search',
    loadChildren: './pages/filter-search/filter-search.module#FilterSearchPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'location',
    loadChildren: './pages/location/location.module#LocationPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'property',
    loadChildren: './pages/property/property.module#PropertyPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'property/:id',
    loadChildren: './pages/property/property.module#PropertyPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'share/:propId',
    loadChildren: './pages/share/share.module#SharePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
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
  },
  {
    path: 'match-property',
    loadChildren: './pages/match/match-property/match-property.module#MatchPropertyPageModule'
  },
  {
    path: 'match-buyer',
    loadChildren: './pages/match/match-buyer/match-buyer.module#MatchBuyerPageModule'
  },
  {
    path: 'message',
    loadChildren: './pages/message/message.module#MessagePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'message/:id',
    loadChildren: './pages/message/message.module#MessagePageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'expiry-profile',
    loadChildren: './pages/expiry/expiry-profile/expiry-profile.module#ExpiryProfilePageModule'
  },
  {
    path: 'profile-buyer',
    loadChildren: './pages/profile/profile-buyer/profile-buyer.module#ProfileBuyerPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-seller',
    loadChildren: './pages/profile/profile-seller/profile-seller.module#ProfileSellerPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'note-add',
    loadChildren: './pages/note-add/note-add.module#NoteAddPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'select-buyer',
    loadChildren: './pages/property/select-buyer/select-buyer.module#SelectBuyerPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'favourites/properties/:buyerId',
    loadChildren: './pages/favourites/properties/properties.module#PropertiesPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'favourites/buyers/:sellerId',
    loadChildren: './pages/favourites/buyers/buyers.module#BuyersPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'filter-search/clients',
    loadChildren: './pages/filter-search/clients/clients.module#ClientsPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/change-password',
    loadChildren: './pages/settings/change-password/change-password.module#ChangePasswordPageModule',
    data: {needUser: true},
    canActivate: [AuthGuard]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
