import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {TabsPage} from './pages/tabs/tabs.page';
import {IonicStorageModule} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Facebook} from '@ionic-native/facebook/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {AppRate} from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';


@NgModule({
  declarations: [
    AppComponent,
    TabsPage,
    ImageViewerComponent,
  ],
  entryComponents: [
    ImageViewerComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Keyboard,
    Geolocation,
    GooglePlus,
    Facebook,
    CallNumber,
    EmailComposer,
    AppRate,
    SocialSharing,
    Camera,
    ImagePicker,
    FirebaseX,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
