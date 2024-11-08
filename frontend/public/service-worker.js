// eslint-disable-next-line no-undef
importScripts('idb.min.js'); // Connecting the UMD assembly

self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch('/asset-manifest.json')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch asset-manifest.json');
      })
      .then((assets) => {
        const urlsToCache = [
          './',
          './index.html',
          assets['files']['main.js'],
          assets['files']['main.css'],
          '/static/media/loading.bbe5d4fd.svg',
          '/static/media/add.3ceadee7.svg',
          '/static/media/arrow-left.a94dd897.svg',
          '/static/media/logout.6450aad3.svg',
          '/static/media/moon.8f2db578.svg',
          '/static/media/share.5cd3841d.svg',
          '/static/media/sun.d68bb1fc.svg',
          '/static/media/logo192.png',
          '/static/media/logo512.png',
        ];
        return caches.open('static-cache').then((cache) => {
          return cache.addAll(urlsToCache).catch((error) => {
            console.error('Failed to cache assets:', error);
          });
        });
      })
      .catch((error) => {
        console.error('Failed to cache assets:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-notes') {
    event.waitUntil(syncOfflineNotes());
  }
});

async function syncOfflineNotes() {
    const db = await idb.openDB('notes-db', 1);
    const notes = await db.getAll('notes');
  
    for (const note of notes) {
      const method = note.deleted ? 'DELETE' : note.isNew ? 'POST' : 'PUT';
      const url = note.isNew ? '/api/notes/' : `/api/notes/${note.id}/`;
  
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: method !== 'DELETE' ? JSON.stringify(note) : undefined,
        });
  
        if (response.ok) {
          const updatedNote = await response.json();
          if (method === 'PUT') {
            await db.put('notes', updatedNote);
          } else if (method === 'POST') {
            await db.delete('notes', note.id);
            await db.put('notes', updatedNote);
          } else {
            await db.delete('notes', note.id);
          }
        } else {
          console.error(`Failed to ${method} note with id ${note.id}`);
        }
      } catch (error) {
        console.error(`Failed to sync note ${note.id}:`, error);
      }
    }
  }
