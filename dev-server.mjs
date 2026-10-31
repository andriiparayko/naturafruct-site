// Local preview server for ./dist (no dependencies).
// Serves pretty URLs like Apache and mocks POST /contact.php so the form can be tested without PHP.
// Usage: node build.mjs && node dev-server.mjs   → http://localhost:8080
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let p = decodeURIComponent(url.pathname);

  if (p === '/contact.php') {
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }
    let size = 0;
    req.on('data', (c) => { size += c.length; });
    req.on('end', () => {
      console.log(`[mock] contact form submitted (${size} bytes) — on the real server contact.php sends the e-mail`);
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, mock: true }));
      }, 700);
    });
    return;
  }

  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: `${p}/${url.search}` }).end(); return; }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    const nf = path.join(ROOT, p.startsWith('/en/') ? 'en/404.html' : '404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    fs.createReadStream(nf).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`NaturaFruct preview → http://localhost:${PORT}`));
