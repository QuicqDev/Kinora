import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../server.mjs';

test('HTTP boundary validates briefs and exposes only public assets', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.deepEqual(await fetch(`${base}/api/status`).then(r => r.json()), { mode: 'sample', qlooConnected: false, llmConnected: false });
    const post = body => fetch(`${base}/api/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const response = await post(JSON.stringify({ name: 'Test Café', seats: 24, staff: 1, budget: 4500, kitchen: false, theme: 'slow-stories' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).format.minStaff, 1);
    assert.equal((await post('{broken')).status, 400);
    assert.equal((await post('{}')).status, 400);
    assert.equal((await post('x'.repeat(9000))).status, 413);
    assert.equal((await fetch(`${base}/api/plan`, { method: 'POST', body: '{}' })).status, 415);
    for (const path of ['/.env', '/server.mjs', '/.git/config']) assert.equal((await fetch(base + path)).status, 404);
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
    assert.match(await page.text(), /Tuesday Fix/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
