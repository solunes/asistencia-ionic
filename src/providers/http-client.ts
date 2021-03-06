import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { LoadingClient } from './loading-client';
import { AppSettings } from './app-settings';
import { AuthService } from './auth-service';

@Injectable()
export class HttpClient {
  token: string;
  timeout_value: number = 5000;

  constructor(public http: Http,
      private storage: Storage,
      private loading: LoadingClient,) {}

  getApiToken() : Observable<any> {
    return Observable.fromPromise(this.storage.get(AuthService.token_key))
  }

  createAuthorizationHeader(token) : Headers{
    let headers = new Headers();
    return headers;
  }

  getRequest(endpoint: string, last_id:number = undefined): Observable<any> {
    console.log(AppSettings.api_url + endpoint)
    return this.getApiToken().flatMap(token => {
      let headers: Headers = new Headers();
      if (token) {
        headers.append('Authorization', 'Bearer ' + token);
      }
      let last_query = ''
      if (last_id) {
        last_query = '?last_id=' + last_id
      }
      return this.http.get(AppSettings.api_url + endpoint + last_query, {headers: headers})
        .timeout(this.timeout_value)
        .map(res =>  res.json())
    });
  }

  postRequest(endpoint: string, body) : Observable<any>{
    return this.getApiToken().flatMap(token => {

      let headers: Headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);

      return this.http.post(AppSettings.api_url + endpoint, body, {headers:headers})
        .timeout(this.timeout_value).map(res =>  res.json())
    });
  }

  public getLastId(data): number{
    if (data) {
      return data[0]['id']
    }
    return 0
  }
}
