import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { IBeacon } from '@ionic-native/ibeacon';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { ToolbarComponent } from './toolbar.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NotificationPage } from '../pages/notification/notification';
import { ProfilePage } from '../pages/profile/profile';

import { AppRouter } from '../providers/app-router';
import { AppSettings } from '../providers/app-settings';
import { AuthService } from '../providers/auth-service';
import { HttpClient } from '../providers/http-client';
import { LoadingClient } from '../providers/loading-client';
import { LocationTracker } from '../providers/location-tracker';
import { BeaconProvider } from '../providers/beacon-provider';

import { OrderByPipe } from '../pipes/OrderBy';
import { Currency } from '../pipes/currency';

@NgModule({
  declarations: [
    MyApp,
    ToolbarComponent,
    HomePage,
    LoginPage,
    NotificationPage,
    ProfilePage,
    Currency,
    OrderByPipe,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ToolbarComponent,
    HomePage,
    LoginPage,
    NotificationPage,
    ProfilePage,
  ],
  providers: [
    AuthService,
    AppRouter,
    AppSettings, 
    HttpClient, 
    Geolocation,
    BackgroundMode,
    BackgroundGeolocation,
    LocationTracker,
    IBeacon,
    BeaconProvider,
    LoadingClient, 
    {provide: LOCALE_ID, useValue: 'es-ES'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ] 
})
export class AppModule {}
