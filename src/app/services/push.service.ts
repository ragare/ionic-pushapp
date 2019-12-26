import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [];

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarMensajes();
   }

   async getMensajes() {
     await this.cargarMensajes();
     return this.mensajes;
   }

  consfiguracionInicial() {
    this.oneSignal.startInit('005282fb-39a1-42a8-945c-6cc1d49f2f6e', '760149441900');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('Notificación recibida', noti);
      this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log('Notificación abierta', noti);
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida(noti: OSNotification) {
    await this.cargarMensajes();
    const payload = noti.payload;
    const existePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID);
    if (existePush) {
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    this.mensajes = await this.storage.get('mensajes') || [];
  }
}
