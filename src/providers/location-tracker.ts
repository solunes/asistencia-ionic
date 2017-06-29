import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTracker {

  watch: any;    
  lat: number = 0;
  lng: number = 0;
  isForeground: boolean = true

  constructor(public zone: NgZone,
    public geolocation: Geolocation,
    public backgroundGeolocation: BackgroundGeolocation) {
    console.log('Hello LocationTracker Provider');
  }

  requestPermmision(){
  }

  backgroundTracking() {
    let config = {
      desiredAccuracy: 100,
      stationaryRadius: 50,
      distanceFilter: 10, 
      debug: true,
      interval: 1000,
      notificationTitle: 'Esperando la ubicación',
      notificationText: 'en segundo plano'
    };
   
    this.backgroundGeolocation.configure(config).subscribe((location) => {
   
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
   
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.isForeground = false
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
   
    }, (err) => console.log(err));
    
    this.backgroundGeolocation.start()
  }

  foreGroundTraking(){
    let options = {
      frequency: 1000, 
      enableHighAccuracy: true
    }

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      
      console.log('ForegroundGeolocation:  ' + position.coords.latitude + ',' + position.coords.longitude);

      this.zone.run(() => {
        this.isForeground = true
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      })
    })    
  }

  stopForegroundTracking() {
    console.log('stopTracking');
    this.watch.unsubscribe();
  }

  stopBackgroundTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.finish();
  }
}
