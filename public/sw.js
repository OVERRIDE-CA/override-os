const CACHE_NAME = 'override-os-v1'

// Cache only static UI shell
const STATIC_ASSETS = [
  '/',
  '/mission',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(() => {}) // Don't block install on cache failure
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // NEVER cache Supabase requests
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.io')) {
    return // Let browser handle normally
  }

  // NEVER cache boarding-pass (always needs fresh Supabase data)
  if (url.pathname.startsWith('/boarding-pass')) {
    return
  }

  // For navigation requests — serve from cache if available
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/mission') || caches.match('/')
      )
    )
    return
  }

  // For static assets — cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  )
})

// Push notifications (future use)
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'OVERRIDE™', {
      body: data.body || 'New mission update.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'override-update',
      data: { url: data.url || '/mission' }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/mission')
  )
})
