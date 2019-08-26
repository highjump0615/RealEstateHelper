import {NgModule} from '@angular/core';
import {CheckBoxComponent} from './check-box/check-box.component';
import {IonicModule} from '@ionic/angular';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import {CommonModule} from '@angular/common';
import { RemoveButtonComponent } from './remove-button/remove-button.component';
import { PropertyImageUploaderComponent } from './property-image-uploader/property-image-uploader.component';

const COMPONENTS = [
  CheckBoxComponent,
  ImageUploaderComponent,
  PropertyImageUploaderComponent,
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class ComponentsModule { }
