import {NgModule} from '@angular/core';
import {CheckBoxComponent} from "./check-box/check-box.component";
import {IonicModule} from "@ionic/angular";

const COMPONENTS = [
  CheckBoxComponent
];

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class ComponentsModule { }
