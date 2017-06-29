import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

import { AuthService } from '../../providers/auth-service';
import { HttpClient } from '../../providers/http-client';
import { AppSettings } from '../../providers/app-settings';
import { LoadingClient } from '../../providers/loading-client';
import { LocationTracker } from '../../providers/location-tracker';

import { ProfilePage } from '../../pages/profile/profile'
import { LoginPage } from '../../pages/login/login'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  key_page: string = '/'
  // esta variable valida la autentificacion 
  isAuth: boolean = true
  title_page: string = 'Home'

  constructor(private navCtrl: NavController, 
    private http: HttpClient,
    private location: LocationTracker,
    private auth: AuthService,
    private backgroundMode: BackgroundMode,
    private loading: LoadingClient,
    private app_settings: AppSettings,
    private storage: Storage) {
    
  }

  ionViewWillEnter(){
    this.startTracking()
  }

  ionViewWillLeave(){
    this.startBackgroundTracking()
  }

  startTracking(){
    this.location.foreGroundTraking()
  }

  startBackgroundTracking(){
    this.location.backgroundTracking()
  }

  stopForeground(){
    this.location.stopForegroundTracking()
  }

  stopBackground(){
    this.location.stopBackgroundTracking()
  }

  updateIsAuth(){
    this.storage.ready().then(() => {})
  }

  getData(){
    this.storage.get(this.key_page).then(data => {
      this.loading.showLoading(data)
      if (data) {
      }
      this.http.getRequest(this.key_page).subscribe(result => {
        this.loading.dismiss()
        this.storage.set(this.key_page, result)
      }, error => this.loading.showError(error))
    })
  }

  perfil(){
    this.navCtrl.push(ProfilePage)
  }

  logout(){
    this.auth.logout().subscribe(succ => {
      this.storage.remove(AuthService.login_key)
      this.storage.remove(AuthService.token_key)
      this.storage.remove(AuthService.expiration_date_key)
      this.updateIsAuth()
    })
  }
}
