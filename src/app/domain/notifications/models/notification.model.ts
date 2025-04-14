export interface Notification {
    title: string;
    body: string;
    data?: Record<string, string>;
  }
 
export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface NotificationToken {
  token: string;
  userId?: string;
  createdAt: Date;
}