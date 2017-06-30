import { Injectable, NgZone } from '@angular/core'
import { BackgroundGeolocation } from '@ionic-native/background-geolocation'
import { Geolocation, Geoposition } from '@ionic-native/geolocation'
import { Observable, Subscription, Subject } from 'rxjs/Rx'
import 'rxjs/add/operator/filter'

import { AppSettings } from '../providers/app-settings'
import { HttpClient } from '../providers/http-client'
import { LoadingClient } from '../providers/loading-client'
/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTracker {

  watch: any
  subjectResult = new Subject<any>() 

  constructor(public zone: NgZone,
    public geolocation: Geolocation,
    public http: HttpClient,
    public loading: LoadingClient,
    public backgroundGeolocation: BackgroundGeolocation) {
  }

  backgroundTracking(interval, user_id, uuid) {
    let config = {
      desiredAccuracy: 100,
      stationaryRadius: 0,
      distanceFilter: 0, 
      debug: true,
      interval: interval,
      stopOnTerminate: false,
      notificationTitle: 'Esperando la ubicación',
      notificationText: 'en segundo plano'
    }
   
    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude)
      this.sendPositionBackground(location.latitude, location.longitude,location.accuracy, 'check', user_id, uuid)

    }, (err) => console.log(err))
    
    this.backgroundGeolocation.start()
  }

  foreGroundTraking(user_id, frequency, action, uuid){
    let options = {
      frequency: frequency, 
      enableHighAccuracy: true
    }

    this.watch = this.geolocation.watchPosition(options)
      .filter((p: any) => p.code === undefined)
      .subscribe((position: Geoposition) => {
        console.log('watch')
        this.stopForegroundTracking()
        this.sendPosition(position.coords.latitude,position.coords.longitude,position.coords.accuracy, action, user_id, uuid)
      })
  }

  sendPosition(lat, lng, acc, action:string, user_id, uuid){
    let endpoint = AppSettings.checkLocation(user_id, action, lat, lng, acc, uuid)
    this.http.getRequest(endpoint).subscribe(result => {
      console.log('next')
      this.subjectResult.next(result)
      this.loading.dismiss()
    }, error => this.loading.showError(error))
  }

  sendPositionBackground(lat, lng, acc, action, user_id, uuid){
    let endpoint = AppSettings.checkLocation(user_id, action, lat, lng, acc, uuid)
    this.http.getRequest(endpoint).subscribe(result => {
      console.log('result Background')
      console.log(JSON.stringify(result))
      if (result['stop_timer']) {
        if (result['start_timer'] > 0) {
          this.stopBackgroundTracking()
          this.backgroundTracking(result['start_timer'], user_id, uuid)
        } else {
          this.stopBackgroundTracking()
        }
      }
    }, error => this.loading.showError(error))
  }

  getResult(): Observable<any>{
    console.log('get result')
    return this.subjectResult.asObservable()
  }

  stopForegroundTracking() {
    console.log('stopTracking')
    this.watch.unsubscribe()
  }

  stopBackgroundTracking() {
    console.log('stopBackgroundTracking')
    this.backgroundGeolocation.finish()
    this.backgroundGeolocation.stop()
  }
}
