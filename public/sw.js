// SwissOut — Service Worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Recevoir une notification push serveur (futur usage VAPID)
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'SwissOut', {
      body: data.body || '',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: data.tag || 'swissout',
    })
  );
});

// Clic sur notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    if (cs.length) return cs[0].focus();
    return clients.openWindow('/');
  }));
});
