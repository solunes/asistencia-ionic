import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';

/*
  Generated class for the BeaconProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class BeaconProvider {
  delegate: any;
  region: any;

  constructor(public platform: Platform, 
    public ibeacon: IBeacon,
    public events: Events) {
  }

  initialise(): any {
    let promise = new Promise((resolve, reject) => {
      console.log(resolve)
      console.log(reject)
      // we need to be running on a device
      if (this.platform.is('cordova')) {

        // Request permission to use location on iOS
        this.ibeacon.requestAlwaysAuthorization();

        // create a new delegate and register it with the native layer
        this.delegate = this.ibeacon.Delegate();

        // Subscribe to some of the delegate’s event handlers
        this.delegate.didRangeBeaconsInRegion().subscribe(data => {
          console.log('didRangeBeaconsInRegion')
          this.events.publish('didRangeBeaconsInRegion', data);
        },
          error => console.error()
        );
        this.delegate.didEnterRegion().subscribe(data => {
          this.events.publish('didEnterRegion', data)
        }, error => console.error(error))

        this.delegate.didStartMonitoringForRegion().subscribe(data => {
          this.events.publish('didStartMonitoringForRegion', data)
          this.region = data.region.identifier;
          console.log(JSON.stringify(data))
        }, error => console.error(error))

        // setup a beacon region – CHANGE THIS TO YOUR OWN UUID
        this.region = this.ibeacon.BeaconRegion('deskBeacon', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825');

        // start ranging
        this.ibeacon.startRangingBeaconsInRegion(this.region).then(() => {
          resolve(true);
        }, error => {
          console.error('Failed to begin monitoring: ', error);
          resolve(false);
        })
        this.ibeacon.getMonitoredRegions().then(value => {

        })
        this.ibeacon.startMonitoringForRegion(this.region).then(value => {
          console.log('startMonitoringForRegion')
          console.log(value)
          resolve(true)
        }, error => console.log(error))
      } else {
        console.error('This application needs to be running on a device');
        resolve(false);
      }
    });
    return promise;
  }

  stop() {
    this.ibeacon.stopRangingBeaconsInRegion(this.region)
      .then(
        () => {},
        error => alert(error)
    );

    this.ibeacon.stopMonitoringForRegion(this.region)
      .then(
        () => {},
        error => alert(error)
    );
  }
}
