import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { makePlan, InputError } from './src/planner.mjs';

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/planner.mjs', ['../src/planner.mjs', 'text/javascript; charset=utf-8']]
]);
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
export const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && path === '/api/status') return json(res, 200, { mode: 'sample', qlooConnected: false, llmConnected: false });
    if (req.method === 'POST' && path === '/api/plan') {
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { error: 'Send a JSON café brief.' });
      let body = ''; let bytes = 0;
      for await (const chunk of req) { bytes += chunk.length; if (bytes > 8192) { json(res, 413, { error: 'Brief is too large.' }); req.resume(); return; } body += chunk; }
      let input; try { input = JSON.parse(body); } catch { return json(res, 400, { error: 'The café brief is not valid JSON.' }); }
      return json(res, 200, makePlan(input));
    }
    if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
    const asset = assets.get(path);
    if (!asset) return json(res, 404, { error: 'Not found.' });
    const data = await readFile(fileURLToPath(new URL(`./public/${asset[0]}`, import.meta.url)));
    res.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-cache' }); res.end(data);
  } catch (error) {
    if (error instanceof InputError) return json(res, 400, { error: error.message });
    json(res, 500, { error: 'Something went wrong. Please try again.' });
  }
});
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  server.listen(port, '127.0.0.1', () => console.log(`Tuesday Fix: http://127.0.0.1:${port} (sample mode)`));
}
