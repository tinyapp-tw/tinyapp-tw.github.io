/* 工具箱 Service Worker — 只快取首頁外殼；各工具由自己的 SW 負責 */
const CACHE = 'hub-v2.02';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-64.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  /* 工具路徑交給各工具自己的 SW（scope 較深者優先），這裡不干涉 */
  if (/^\/(subman|parking|bills|retire)\//.test(url.pathname)) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            e.waitUntil(caches.open(CACHE).then((c) => c.put('./index.html', copy)));
            return res;
          }
          /* 404 / 5xx 對 fetch 來說也算「成功」，不會走到下面的 catch。
             站台被刪、Pages 被關或 GitHub 出錯時，寧可給快取裡還能用的版本，也不要丟一張錯誤頁給使用者 */
          return caches.match('./index.html').then((hit) => hit || res);
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)));
        }
        return res;
      });
    })
  );
});
