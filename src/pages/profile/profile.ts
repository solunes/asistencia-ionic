import { Component, trigger, animate, state, style, transition } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HttpClient } from '../../providers/http-client';
import { LoadingClient } from '../../providers/loading-client';
import { AppSettings } from '../../providers/app-settings';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [
    trigger('itemState', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      //Enter
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-50%)'
        }),
        animate('400ms ease-in-out')
      ]),
    ])
  ]
})
export class ProfilePage {
  title_page = 'Mi Cuenta';
  notificationsCount: number;
  key_page: string = '/my-profile'
  profile = {name:'', email: '', rank: ''}
  app_var: string

  constructor(public navCtrl: NavController, 
      public loading: LoadingClient,
      public storage: Storage,
      public http: HttpClient,
      public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  getData(){
    this.storage.get(this.key_page).then(data => {
      this.loading.showLoading(data)
      if (data) {
        this.profile = data
      }
      this.http.getRequest(this.key_page).subscribe(result => {
        this.profile = result['profile']
        this.loading.dismiss()
        this.storage.set(this.key_page, this.profile)
      }, error => this.loading.showError(error))
    })
  }

}
