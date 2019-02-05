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
    loadChildren: './tabs/tabs.module#TabsPageModule'
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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
