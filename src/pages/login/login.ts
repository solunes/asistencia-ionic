import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AppRouter } from '../../providers/app-router';
import { LoadingClient } from '../../providers/loading-client';
import { HttpClient } from '../../providers/http-client';
import { AppSettings } from '../../providers/app-settings';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [DatePipe]
})
export class LoginPage {
  title_page: string = 'Iniciar Sesión'
  notificationsCount: number
  loginCredentials = {user: '', password: ''};
  register = {
    name: '', 
    email: '', 
    city: '', 
    zone: '', 
    address: '', 
    phone: '', 
    customer: false,
    date: null,
    gym_id: null
  }
  gyms = []
  gym_key: number = 0
  key_places: string = '/places'
  is_spazio: boolean = false
  app_var: string
  date = new Date().toISOString()

  constructor(private nav: NavController, 
    private auth: AuthService, 
    private storage: Storage,
    private loading: LoadingClient,
    private app_router: AppRouter, 
    public http: Http,
    public httpClient: HttpClient,
    public datePipe: DatePipe,
    public navParam: NavParams) {
  }

  public login(){
    this.loginCredentials.password = this.loginCredentials.user
    this.auth.login(this.loginCredentials).subscribe(allowed => {
      if (allowed) {
        this.loading.dismiss();
        this.handleResult(allowed)
      } else {
        this.loading.showError("Acceso denegado");
      }
    }, error => {
      this.loading.showError(error);
    })
  }

  free(){
    console.log('free')
  }

  onChange(event){
    console.log(this.gym_key)
  }

  onChangeToggle(event){
    if (this.register.customer) {
      if (this.gym_key == 0) {
        this.gym_key = null
      }
      this.gyms.shift()
    } else {
      if (this.gym_key == null) {
        this.gym_key = 0
      }
      let default_gym = {
        id: 0,
        name: 'Cualquiera'
      }
      this.gyms.unshift(default_gym)
    }
  }

  handleResult(data){
    this.storage.set(this.app_var + AuthService.login_key, true);
    this.storage.set(this.app_var + AuthService.token_key, data[AuthService.token_key]);
    this.storage.set(AuthService.expiration_date_key, data[AuthService.expiration_date_key]);
    //this.storage.set('tipo', data['tipo']);
    //this.storage.set('id_user', data['id_user']);
    this.nav.setRoot(this.app_router.getPage('home'));
  }

  ionViewWillLeave(){
    //this.menu.enable(true);
  }
}
