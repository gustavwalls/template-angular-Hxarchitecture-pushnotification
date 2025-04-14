import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NOTIFICATION_REPOSITORY_PORT, NotificationPort } from '../ports/notification.repository.port';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationUseCase {
  constructor( @Inject(NOTIFICATION_REPOSITORY_PORT) private notificationPort: NotificationPort) {}
  
  requestPermission(): Observable<boolean> {    
    return this.notificationPort.requestPermission();
  }
  
  getToken(): Observable<string | null> {
    return this.notificationPort.getToken();
  }
  
  saveToken(token: string, userId?: string): Observable<void> {
    return this.notificationPort.saveToken(token, userId);
  }
  
  onMessage(): Observable<Notification> {
    return this.notificationPort.onMessage();
  }
  
  onNotificationClick(): Observable<any> {
    return this.notificationPort.onNotificationClick();
  }
  
  subscribeToTopic(topic: string): Observable<void> {
    return this.notificationPort.subscribeToTopic(topic);
  }
  
  unsubscribeFromTopic(topic: string): Observable<void> {
    return this.notificationPort.unsubscribeFromTopic(topic);
  }
}