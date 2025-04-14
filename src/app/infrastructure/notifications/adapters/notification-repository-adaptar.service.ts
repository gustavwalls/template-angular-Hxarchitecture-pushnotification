import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { Observable, fromEvent, Subject, from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { getFirestore, setDoc, doc, Timestamp } from 'firebase/firestore';
import { environment } from '../../../../environments/environments';
import { NotificationPort } from '../../../domain/notifications/ports/notification.repository.port';
import { PushNotification } from '../../../domain/notifications/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseNotificationAdapter implements NotificationPort {
  
  private messaging!: Messaging;
  private firestore;
  private messageSubject = new Subject<PushNotification>();

  constructor() {
    // Inicializar Firebase
    const app = initializeApp(environment.firebase);
    this.firestore = getFirestore(app);
    
    // Inicializar Firebase Messaging si estamos en un navegador
    if (typeof window !== 'undefined') {
      this.messaging = getMessaging(app);
      
      // Manejo de mensajes cuando la app está en primer plano
      onMessage(this.messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        this.messageSubject.next({
          title: payload.notification?.title || '',
          body: payload.notification?.body || '',
          data: payload.data
        });
      });
    }
  }

  requestPermission(): Observable<boolean> {
    return from(Notification.requestPermission()).pipe(
      map(permission => permission === 'granted'),
      catchError(error => {
        console.error('Error al solicitar permiso de notificación:', error);
        return of(false);
      })
    );
  }

  getToken(): Observable<string | null> {
    return from(
      getToken(this.messaging, {
        vapidKey: environment.firebase.apiKey
      })
    ).pipe(
      tap(token => {
        if (token) {
          console.log('Token de dispositivo obtenido');
        } else {
          console.log('No se pudo obtener el token');
        }
      }),
      catchError(error => {
        console.error('Error al obtener el token:', error);
        return of(null);
      })
    );
  }

  saveToken(token: string, userId?: string): Observable<void> {
    const tokenId = userId ? `${userId}_${token.substring(0, 10)}` : token.substring(0, 20);
    
    return from(
      setDoc(doc(this.firestore, 'notification_tokens', tokenId), {
        token,
        userId: userId || null,
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now()
      })
    ).pipe(
      tap(() => console.log('Token guardado en Firestore')),
      catchError(error => {
        console.error('Error al guardar el token:', error);
        throw error;
      })
    );
  }

  onMessage(): Observable<PushNotification> {
    return this.messageSubject.asObservable();
  }

  onNotificationClick(): Observable<any> {
    return fromEvent(navigator.serviceWorker, 'message').pipe(
      map((event: any) => {
        if (event.data?.firebaseMessaging?.type === 'notification-clicked') {
          return event.data.firebaseMessaging.payload;
        }
        return null;
      })
    );
  }

  subscribeToTopic(topic: string): Observable<void> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('No token available');
        }
        
        // Nota: La suscripción a temas requiere un backend o Cloud Functions
        // Aquí simularíamos la llamada a una Cloud Function de Firebase
        console.log(`Suscrito al tema: ${topic} con token: ${token}`);
        return of(undefined);
      }),
      catchError(error => {
        console.error('Error al suscribirse al tema:', error);
        throw error;
      })
    );
  }

  unsubscribeFromTopic(topic: string): Observable<void> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('No token available');
        }
        
        // Nota: La desuscripción de temas requiere un backend o Cloud Functions
        console.log(`Desuscrito del tema: ${topic} con token: ${token}`);
        return of(undefined);
      }),
      catchError(error => {
        console.error('Error al desuscribirse del tema:', error);
        throw error;
      })
    );
  }
}