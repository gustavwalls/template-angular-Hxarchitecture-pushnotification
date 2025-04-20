importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
 /*  apiKey: "AIzaSyCcwk5RPAxXrI5bUoaITNZ6YYHDyGMV4xE",
  authDomain: "mis-notificaciones-81908.firebaseapp.com",
  projectId: "mis-notificaciones-81908",
  storageBucket: "mis-notificaciones-81908.firebasestorage.app",
  messagingSenderId: "96751627943",
  appId: "1:96751627943:web:46825376def79dd2f0b582",
  measurementId: "G-WQ8F69ZV7L",
  vapidKey: "BFpU11WzHDuuxyvsVh9JSPY2fbu3qtClIKJoE3CH5s_Gl-o8TrIfzN3tW7XTIXZ7m9KEX1fSiYhHCwdC087zOt4" */

  apiKey: "AIzaSyC1wmILfIEeoFunefCAUgnqMQB5IiJf54E",
  authDomain: "midoc-a3bb1.firebaseapp.com",
  projectId: "midoc-a3bb1",
  storageBucket: "midoc-a3bb1.firebasestorage.app",
  messagingSenderId: "99339029822",
  appId: "1:99339029822:web:33ac22a99cf9a65521f06f",
  vapidKey: "BExzxgEpuqWo-fY12GlCsA0WZAsVH_P0-LY_LfcOzlYQqDwWfWEunodEiFgN0kpXuk93PO91pARCiPAK30PGUPA" 

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