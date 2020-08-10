import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocationPage } from './location.page';
import {AgmCoreModule} from '@agm/core';
import {config} from '../../helpers/config';

const routes: Routes = [
  {
    path: '',
    component: LocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: config.googleMapApiKey,
      libraries: ['geometry', 'places']
    })
  ],
  declarations: [LocationPage]
})
export class LocationPageModule {}
