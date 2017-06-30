import { Component, Input, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { Geoposition } from '@ionic-native/geolocation'
import { Observable, Subscription, Subject } from 'rxjs/Rx'

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
  // esta variable valida la autentificacion 
  isAuth: boolean = true
  title_page: string = 'Inicio'
  logged: boolean = true
  schedules = []
  user_id: number
  ibeacon_uuid = ''
  subscriptor: Subscription
  status: boolean = false

  constructor(private navCtrl: NavController, 
    private http: HttpClient,
    private location: LocationTracker,
    private auth: AuthService,
    private zone: NgZone,
    private loading: LoadingClient,
    private app_settings: AppSettings,
    private storage: Storage) {

    storage.get(AppSettings.status_key).then((value:boolean) => this.status = value)
    storage.get(AuthService.user_id_key).then(value => this.user_id = value)
    this.getData()
    this.subscriptorResult()
  }

  ionViewWillEnter(){
  }

  ionViewWillLeave(){}

  subscriptorResult(){
    this.location.getResult().subscribe(result => {
      console.log(result)

      this.storage.set(AppSettings.schedules_key, result['schedules_array'])
      this.getData()

      if (!this.status) {
        this.status = true
        this.location.backgroundTracking(result['start_timer'], this.user_id, this.ibeacon_uuid)
      } else {
        this.status = false
        this.location.stopBackgroundTracking()
      }
      this.storage.set(AppSettings.status_key, this.status)
    })
  }

  getData(){
    this.storage.get(AppSettings.schedules_key).then(data => {
      if (data) {
        this.schedules = []
        for (let key in data) {
          let schedule = data[key]
          this.schedules.push({date: key, schedule: schedule})
        }
      }
    })
  }

  ingresar(){
    this.loading.showLoading(1)
    this.location.foreGroundTraking(this.user_id, 200, 'in', this.ibeacon_uuid)
  }

  salida(){
    this.loading.showLoading(1)
    this.location.foreGroundTraking(this.user_id, 200, 'out', this.ibeacon_uuid)    
  }
}
