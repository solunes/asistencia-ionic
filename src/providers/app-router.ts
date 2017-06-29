import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthService } from '../providers/auth-service';

import { HomePage } from '../pages/home/home';

export class Router {
  path: string
  component: any
  data:{
    title:string
  }
}

@Injectable()
export class AppRouter {
  registrado: boolean
  appRoutes: Array<Router>

  constructor(public storage: Storage) {
    this.appRoutes = this.getAppRouter()
  }
  
  getPage(path) : any{
    return this.appRoutes.find(x => x.path == path).component;
  }

  getAppRouter() : Array<Router>{
    return [
      {
        path: 'home', component: HomePage, 
        data: { title: 'Inicio' }
      },
    ]
  }
}
