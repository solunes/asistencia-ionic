import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AppSettings {
  static api_url: string = 'http://asistencia.solunes.com/api'
  static endpoints = {
    home: '/check-location',
    auth: '-auth/authenticate',
  }

  constructor() {}

  static checkLocation(user_id, action, lat, lng, accuracy, uuid=''){
    return this.api_url + '/check-location/' + user_id + '/' + action + '/' + lat + '/' + lng + '/' + accuracy + '/' + uuid
  }
}
