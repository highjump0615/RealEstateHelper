import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../guards/auth/auth.guard";

const routes: Routes = [
    {
      path: 'home',
      loadChildren: '../home/home.module#HomePageModule',
    },
    {
      path: 'matches',
      loadChildren: '../match/matches/matches.module#MatchesPageModule',
    },
    {
      path: 'favourites',
      loadChildren: '../favourites/favourites.module#FavouritesPageModule',
    },
    {
      path: 'chat',
      loadChildren: '../chat/chat.module#ChatPageModule',
    },
    {
      path: 'notifications',
      loadChildren: '../notifications/notifications.module#NotificationsPageModule',
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
