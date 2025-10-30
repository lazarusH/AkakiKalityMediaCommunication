const CACHE_NAME = 'akaki-kality-v3';
const urlsToCache = [
  '/',
  '/ዜና.png',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip caching for external APIs (CORS proxies, Flickr, Supabase, etc.)
  const isExternalAPI = 
    requestUrl.hostname.includes('corsproxy.io') ||
    requestUrl.hostname.includes('allorigins.win') ||
    requestUrl.hostname.includes('flickr.com') ||
    requestUrl.hostname.includes('supabase.co') ||
    requestUrl.hostname.includes('youtube.com') ||
    requestUrl.hostname.includes('googleapis.com');
  
  // For external APIs, just fetch directly without caching
  if (isExternalAPI) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For local resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch((error) => {
          console.log('Fetch failed; returning offline page instead.', error);
          return response;
        });
      })
  );
});

