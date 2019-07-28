import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileAddPage } from './profile-add.page';
import {ComponentsModule} from '../../../components/components.module';
import {TextMaskModule} from 'angular2-text-mask';

const routes: Routes = [
  {
    path: '',
    component: ProfileAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    TextMaskModule
  ],
  declarations: [ProfileAddPage]
})
export class ProfileAddPageModule {}
