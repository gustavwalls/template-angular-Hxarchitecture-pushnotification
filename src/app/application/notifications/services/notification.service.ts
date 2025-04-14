import { Injectable } from '@angular/core';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';
import { NotificationUseCase } from '../../../domain/notifications/user-cases/notification.use-case';
import { Notification } from '../../../domain/notifications/models/notification.model';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private notificationUseCase: NotificationUseCase) {}

  requestPermission(): Observable<boolean> {
    return this.notificationUseCase.requestPermission();
  }

  getToken(): Observable<string | null> {
    return this.notificationUseCase.getToken();
  }

  saveToken(token: string, userId?: string): Observable<void> {
    return this.notificationUseCase.saveToken(token, userId);
  }

  onMessage(): Observable<Notification> {
    return this.notificationUseCase.onMessage();
  }

  onNotificationClick(): Observable<any> {
    return this.notificationUseCase.onNotificationClick();
  }

  subscribeToTopic(topic: string): Observable<void> {
    return this.notificationUseCase.subscribeToTopic(topic);
  }

  unsubscribeFromTopic(topic: string): Observable<void> {
    return this.notificationUseCase.unsubscribeFromTopic(topic);
  }

  // Método para inicializar el servicio de notificaciones con observables
  initialize(userId?: string): Observable<boolean> {
    return this.requestPermission().pipe(
      switchMap(permission => {
        if (!permission) {
          return of(false);
        }
        
        return this.getToken().pipe(
          switchMap(token => {
            if (!token) {
              return of(false);
            }
            
            return this.saveToken(token, userId).pipe(
              tap(() => console.log('Token saved successfully')),
              switchMap(() => of(true)),
              catchError(error => {
                console.error('Error saving token:', error);
                return of(false);
              })
            );
          })
        );
      })
    );
  }
}