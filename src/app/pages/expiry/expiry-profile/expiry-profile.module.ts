import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpiryProfilePage } from './expiry-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ExpiryProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpiryProfilePage]
})
export class ExpiryProfilePageModule {}
