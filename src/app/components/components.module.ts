import {NgModule} from '@angular/core';
import {CheckBoxComponent} from "./check-box/check-box.component";
import {IonicModule} from "@ionic/angular";
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import {CommonModule} from "@angular/common";
import { RemoveButtonComponent } from './remove-button/remove-button.component';

const COMPONENTS = [
  CheckBoxComponent,
  ImageUploaderComponent,
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
