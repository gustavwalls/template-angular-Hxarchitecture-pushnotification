importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCcwk5RPAxXrI5bUoaITNZ6YYHDyGMV4xE",
    authDomain: "mis-notificaciones-81908.firebaseapp.com",
    projectId: "mis-notificaciones-81908",
    storageBucket: "mis-notificaciones-81908.firebasestorage.app",
    messagingSenderId: "96751627943",
    appId: "1:96751627943:web:46825376def79dd2f0b582",
    measurementId: "G-WQ8F69ZV7L"
});

const messaging = firebase.messaging();

// Manejo de notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/assets/icons/icon-192x192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejo de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Esto abre la ventana de la aplicación en caso de que esté cerrada
  // o enfoca la pestaña si ya está abierta
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});