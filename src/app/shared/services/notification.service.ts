// shared/services/notification.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Observable, Subject, from } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging;
  private notificationSubject = new Subject<any>();
  
  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
    
    onMessage(this.messaging, (payload) => {
      this.notificationSubject.next(payload);
    });
  }

  // Solicitar permiso y obtener token
  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return null;
      }
  
      // Registra el service worker explícitamente
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope/'
      });
  
      return await getToken(this.messaging, {
        vapidKey: environment.firebase.vapidKey, // 👈 Usa la clave VAPID
        serviceWorkerRegistration: registration
      });
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }
  
  // Escuchar notificaciones
  getNotifications(): Observable<any> {
    return this.notificationSubject.asObservable();
  }
}