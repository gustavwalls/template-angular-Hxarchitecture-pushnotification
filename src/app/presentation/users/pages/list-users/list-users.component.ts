import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../../../domain/users/models/post.model';
import { PostService } from '../../../../application/users/services/post.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';
import { PushNotification } from '../../../../domain/notifications/models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-list-users',
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
})
export default class ListUsersComponent implements OnInit,OnDestroy {
  posts: Post[] = [];
  lastNotification: PushNotification | null = null;
  notificationSubscription: Subscription | null = null;
  notificationEnabled = false;

  constructor(
    private postService: PostService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  
  loadPosts(): void {
    this.postService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
      console.log('🟩🟩🟩🟩🟩', this.posts);
    });
  }

  async activateNotifications() {
    // Evitar múltiples activaciones
    if (this.notificationEnabled) {
      alert('Las notificaciones ya están activadas');
      return;
    }

    try {
      const token = await this.notificationService.requestPermissionAndGetToken();
      if (token) {
        console.log('Token obtenido:', token);
        this.notificationEnabled = true;
        
        // Suscribirse a las notificaciones
        this.notificationSubscription = this.notificationService.getNotifications().subscribe(notification => {
          console.log('Notificación recibida:', notification);
          
          // Extraer la información relevante
          this.lastNotification = {
            title: notification.notification?.title || 'Nueva notificación',
            body: notification.notification?.body || 'Has recibido una nueva notificación',
            data: notification.data
          };
          
          // También podrías mostrar una notificación toast o modal
          this.showToastNotification(this.lastNotification);
        });
        
        alert('¡Notificaciones activadas correctamente!');
      } else {
        alert('No se pudo activar las notificaciones. Permiso denegado.');
      }
    } catch (error) {
      console.error('Error al activar las notificaciones:', error);
      alert('Ocurrió un error al activar las notificaciones');
    }
  }
  
  // Método para mostrar una notificación toast (puedes usar una librería como ngx-toastr)
  private showToastNotification(notification: PushNotification) {
    // Implementación básica - puedes reemplazar esto con tu librería preferida
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <h4>${notification.title}</h4>
      <p>${notification.body}</p>
    `;
    document.body.appendChild(toast);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000);
  }
}
