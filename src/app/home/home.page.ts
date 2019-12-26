import { Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor(public pushService: PushService) {}

  ngOnInit() {
    this.pushService.pushListener.subscribe(noti => {
      this.mensajes.unshift(noti);
    });
  }

  ionViewWillEnter() {
    this.mensajes = this.pushService.getMensajes();
  }

}
