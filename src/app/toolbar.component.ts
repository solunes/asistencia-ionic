import { Component, Input, Output, EventEmitter } from '@angular/core'
import { AuthService } from '../providers/auth-service'
import { Storage } from '@ionic/storage'
import { NavController} from 'ionic-angular'

import { NotificationPage } from '../pages/notification/notification'
import { AppSettings } from '../providers/app-settings'

@Component({
  selector: 'toolbar',
  template: `
  <ion-header class="header header-md">
      <ion-navbar class="toolbar toolbar-md statusbar-padding">
        <button ion-button menuToggle>
            <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>
            {{ title_page }}
        </ion-title>

        <ion-buttons end >
          <button ion-button *ngIf="loading"><ion-spinner icon="android"></ion-spinner></button>
        </ion-buttons>
      </ion-navbar>
  </ion-header>
`
})
export class ToolbarComponent{
  @Input() title_page: string = 'Toolbar'
  @Input() loading: boolean = false

  constructor(private navCtrl: NavController, 
      private auth: AuthService, 
      private storage: Storage){
    storage.ready().then(() => {})
  }

  public showNotifi(){
    this.navCtrl.push(NotificationPage)
  }
}