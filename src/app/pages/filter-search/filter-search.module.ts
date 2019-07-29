import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FilterSearchPage } from './filter-search.page';
import {TextMaskModule} from "angular2-text-mask";

const routes: Routes = [
  {
    path: '',
    component: FilterSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TextMaskModule,
  ],
  declarations: [FilterSearchPage]
})
export class FilterSearchPageModule {}
