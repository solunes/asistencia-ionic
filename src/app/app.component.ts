import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Platform, MenuController, AlertController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AppSettings } from '../providers/app-settings';
import { AuthService } from '../providers/auth-service';
import { LocationTracker } from '../providers/location-tracker';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(public platform: Platform,
    private storage: Storage, 
    private backgroundMode: BackgroundMode,
    private location: LocationTracker,
    public alertCtrl: AlertController,
    public menu: MenuController) {
    
    platform.ready().then(() => {
      /*storage.clear()*/
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      // pregunta si se esta usando un dispositivo mobil 
      if (this.platform.is('cordova')) {
        Splashscreen.hide();
        StatusBar.styleDefault();
        this.backgroundMode.configure({silent:true})
        this.backgroundMode.enable()
        this.backgroundMode.overrideBackButton()
        this.platform.registerBackButtonAction(() => {
          console.log('BackButtonAction')
        },10)
      }
      this.initApp()
    });
  }

  public initApp(){
    this.storage.get(AuthService.login_key).then(value => {
      if (value) {
        this.rootPage = HomePage
      } else {
        this.rootPage = LoginPage
      }
    })
  }
}
