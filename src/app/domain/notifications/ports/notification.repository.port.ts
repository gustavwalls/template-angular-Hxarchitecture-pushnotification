import { Observable } from 'rxjs';
import { Notification, NotificationToken, PushNotification } from '../models/notification.model';
import { InjectionToken } from '@angular/core';

export const NOTIFICATION_REPOSITORY_PORT = new InjectionToken<NotificationPort>('NotificationPort');

export interface NotificationPort {
 /**
   * Solicita permiso para recibir notificaciones
   */
 requestPermission(): Observable<boolean>;

 /**
  * Obtiene el token de notificación para el dispositivo actual
  */
 getToken(): Observable<string | null>;

 /**
  * Guarda el token de notificación
  */
 saveToken(token: string, userId?: string): Observable<void>;

 /**
  * Escucha los mensajes de notificación en primer plano
  */
 onMessage(): Observable<PushNotification>;

 /**
  * Escucha cuando se hace clic en una notificación
  */
 onNotificationClick(): Observable<any>;

 /**
  * Suscribe a un tema para recibir notificaciones
  */
 subscribeToTopic(topic: string): Observable<void>;

 /**
  * Desuscribe de un tema
  */
 unsubscribeFromTopic(topic: string): Observable<void>;
}