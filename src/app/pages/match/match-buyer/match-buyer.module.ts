import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MatchBuyerPage } from './match-buyer.page';
import {RemoveButtonComponent} from '../../../components/remove-button/remove-button.component';

const routes: Routes = [
  {
    path: '',
    component: MatchBuyerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    RemoveButtonComponent
  ],
  declarations: [
    MatchBuyerPage,
    RemoveButtonComponent
  ]
})
export class MatchBuyerPageModule {}
