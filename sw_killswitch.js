// Kill-switch service worker.
//
// Earlier deploys registered Flutter's caching service worker, which keeps
// serving the old build to returning visitors. New builds ship without a
// service worker, but browsers that already have the old one only replace it
// with whatever is at this same URL. So this file takes its place, wipes the
// caches, unregisters itself, and reloads the page so the fresh build loads.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
