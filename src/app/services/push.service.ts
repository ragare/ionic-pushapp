import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarMensajes();
   }

   async getMensajes() {
     await this.cargarMensajes();
     return [...this.mensajes];
   }

  consfiguracionInicial() {
    this.oneSignal.startInit('005282fb-39a1-42a8-945c-6cc1d49f2f6e', '760149441900');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('Notificación recibida', noti);
      this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe( async(noti) => {
      // do something when a notification is opened
      console.log('Notificación abierta', noti);
      await this.notificacionRecibida(noti.notification);
    });

    // Obtener id del subscriptor
    this.oneSignal.getIds().then(info => {
      this.userId = info.userId;
      console.log('UserId', this.userId);
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
    await this.guardarMensajes();
  }

  guardarMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }
}
