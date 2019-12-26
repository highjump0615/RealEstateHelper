import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../guards/auth/auth.guard";

const routes: Routes = [
    {
      path: 'home',
      loadChildren: '../home/home.module#HomePageModule',
      canActivate: [AuthGuard],
    },
    {
      path: 'matches',
      loadChildren: '../match/matches/matches.module#MatchesPageModule',
      data: {needUser: true},
      canActivate: [AuthGuard],
    },
    {
      path: 'favourites',
      loadChildren: '../favourites/favourites.module#FavouritesPageModule',
      data: {needUser: true},
      canActivate: [AuthGuard],
    },
    {
      path: 'chat',
      loadChildren: '../chat/chat.module#ChatPageModule',
      data: {needUser: true},
      canActivate: [AuthGuard],
    },
    {
      path: 'notifications',
      loadChildren: '../notifications/notifications.module#NotificationsPageModule',
      data: {needUser: true},
      canActivate: [AuthGuard],
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
