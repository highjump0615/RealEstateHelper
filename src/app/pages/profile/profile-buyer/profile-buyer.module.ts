import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileBuyerPage } from './profile-buyer.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileBuyerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileBuyerPage]
})
export class ProfileBuyerPageModule {}
