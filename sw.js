

const VERSION = "v2.1";

const cacheName = `mykjv-${VERSION}`;
const staticAssets = [
  '/',
  '/index.html',
  '/mykjv.js',
  '/sw.js',
  '/tinyGesture.js',
  '/main.css',
  '/kjv.js',
  '/kjv-1611.js',
  '/tska.js',
  '/headings.js',
  '/headings1611.js',
  '/footNotes.js',
  '/bookIdx.js',
  '/findRefs.js',
  '/lists.js',
  '/texts.js',
  '/icon/apple-icon-192.png',
  '/icon/book-clock.png',
  '/icon/book-open-page.png',
  '/icon/book-open.png',
  '/icon/book.png',
  '/icon/bookshelf.png',
  '/icon/close.png',
  '/icon/dots.png',
  '/icon/file-edit.png',
  '/icon/icon-128.png',
  '/icon/icon-144.png',
  '/icon/icon-152.png',
  '/icon/icon-192.png',
  '/icon/icon-284.png',
  '/icon/icon-48.png',
  '/icon/icon-512.png',
  '/icon/icon-72.png',
  '/icon/icon-96.png',
  '/icon/lock-open.png',
  '/icon/lock.png',
  '/icon/magnify.png',
  '/icon/menu.png',
  '/icon/plus-box.png',
  '/icon/view-list.png',  
  '/fonts/IMFell-roman.woff',
  '/fonts/IMFell-italic.woff',
  '/fonts/KJV1611.otf',
  '/fonts/Lora-Regular.woff',
  '/fonts/Lora-Italic.woff',
];



self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(staticAssets);
  })());
});




self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { 
		return r; 
	}
	const response = await fetch(e.request);
	const cache = await caches.open(cacheName);
	console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
	cache.put(e.request, response.clone());
	return response;
  })());
});


