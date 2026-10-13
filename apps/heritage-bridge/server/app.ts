import express from 'express';
import path from 'node:path';
import { z } from 'zod';
import { requestSignal } from './execution';
import { appRoot, config, mode } from './config';
import { coverage, catalog } from './catalog';
import { collections } from '../shared/collections';
import { DiscoveryService } from './discovery';
import { requestSchema, connectionSchema } from './policy';
import { library, publishedWorks, libraryVersion } from '../shared/library';
import { planRequestSchema } from './planning';
export function createApp(service = new DiscoveryService(), settings = config) {
  const app = express();
  app.disable('x-powered-by');
  if (settings.trustProxy.length) app.set('trust proxy', settings.trustProxy);
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    if (req.path.startsWith('/api')) res.setHeader('Cache-Control', 'no-store');
    next();
  });
  // Only the configured public origin and local development origins may call the API.
  app.use('/api', (req, res, next) => {
    const origin = req.get('origin');
    if (
      origin &&
      ![
        'http://127.0.0.1:5180',
        'http://localhost:5180',
        `http://127.0.0.1:${settings.port}`,
        `http://localhost:${settings.port}`,
        settings.publicOrigin,
      ].includes(origin)
    ) {
      res.status(403).json({ error: 'This origin is not allowed.' });
      return;
    }
    next();
  });
  app.use(express.json({ limit: '20kb' }));
  const calls = new Map<string, { start: number; count: number }>();
  let inFlight = 0;
  const daily = new Map<string, { day: string; count: number }>();
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET' && ['/status', '/library'].includes(req.path)) {
      next();
      return;
    }
    const ip = req.ip ?? 'local';
    const now = Date.now();
    for (const [key, v] of calls) if (now - v.start > 60_000) calls.delete(key);
    const state = calls.get(ip) ?? { start: now, count: 0 };
    state.count++;
    calls.set(ip, state);
    if (state.count > settings.requestLimit) {
      res.setHeader('Retry-After', '60');
      res
        .status(429)
        .json({ error: 'A few too many requests. Please wait a minute and try again.' });
      return;
    }
    next();
  });
  async function job(
    req: express.Request,
    res: express.Response,
    work: (signal: AbortSignal) => Promise<unknown>,
  ) {
    if (inFlight >= 2) {
      res.status(429).json({ error: 'Discovery is busy. Please try again shortly.' });
      return;
    }
    const ip = req.ip ?? 'local';
    const day = new Date().toISOString().slice(0, 10);
    for (const [key, entry] of daily) if (entry.day !== day) daily.delete(key);
    const client = daily.get(ip) ?? { day, count: 0 };
    if (client.count >= settings.clientDailyLimit) {
      res.status(429).json({
        error:
          'Personalization is paused from this connection today. Browsing and your album still work.',
      });
      return;
    }
    client.count++;
    daily.set(ip, client);
    inFlight++;
    const cancelled = new AbortController();
    const signal = requestSignal(cancelled.signal, settings.requestTimeout);
    const closed = () => {
      if (!res.writableFinished) cancelled.abort();
    };
    const expired = () => {
      if (!res.destroyed && !res.headersSent)
        res.status(504).json({
          error: 'Personalization took too long. Your choices are kept; please try again.',
        });
    };
    res.once('close', closed);
    signal.addEventListener('abort', expired, { once: true });
    try {
      const data = await work(signal);
      if (!res.destroyed && !res.headersSent) res.json(data);
    } catch {
      if (!res.destroyed && !res.headersSent)
        res.status(503).json({
          error: 'Personalization is unavailable. Your choices, collections and album are kept.',
        });
    } finally {
      // A closed response does not mean the provider job has stopped.
      inFlight--;
      res.off('close', closed);
      signal.removeEventListener('abort', expired);
    }
  }
  app.get('/api/status', (_req, res) =>
    res.json({
      mode: mode(),
      collections,
      works: catalog.filter((w) => w.metadataStatus === 'reviewed'),
      coverage: coverage(),
      message:
        mode() === 'fixture'
          ? 'Sample data. No live Qloo evidence.'
          : mode() === 'live'
            ? 'Live discovery enabled. Only verified collection identities can be ranked.'
            : 'Add both server-side keys to enable live discovery.',
    }),
  );
  app.get('/api/library', (_req, res) =>
    res.json({
      version: libraryVersion,
      collections: library,
      works: publishedWorks,
      source: 'editorial',
    }),
  );
  app.post('/api/connect', async (req, res) => {
    const input = connectionSchema.safeParse(req.body);
    if (!input.success) {
      res
        .status(400)
        .json({ error: 'Explicitly like a work and choose a target collection and format.' });
      return;
    }
    await job(req, res, (signal) => service.connect(input.data, signal));
  });
  app.get('/api/search', async (req, res) => {
    const input = z
      .object({ q: z.string().min(2).max(180), kind: z.enum(['movie', 'artist', 'book']) })
      .safeParse(req.query);
    if (!input.success) {
      res.status(400).json({ error: 'Enter at least two characters and choose a format.' });
      return;
    }
    await job(req, res, (signal) => service.search(input.data.q, input.data.kind, signal));
  });
  app.post('/api/plan', async (req, res) => {
    const input = planRequestSchema.safeParse(req.body);
    if (!input.success) {
      res
        .status(400)
        .json({ error: 'Choose a collection and describe the moment in 5–500 characters.' });
      return;
    }
    await job(req, res, (signal) => service.plan(input.data, signal));
  });
  app.post('/api/discover', async (req, res) => {
    const input = requestSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ error: 'Choose three distinct favorites and a valid collection.' });
      return;
    }
    await job(req, res, (signal) => service.discover(input.data, signal));
  });
  app.use(express.static(path.join(appRoot, 'dist'), { dotfiles: 'deny' }));
  app.get('/', (_req, res) => res.sendFile(path.join(appRoot, 'dist/index.html')));
  app.get(/^\/(?:explore|album|collections\/[a-z0-9-]+|works\/[a-z0-9-]+)\/?$/, (_req, res) =>
    res.sendFile(path.join(appRoot, 'dist/index.html')),
  );
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use(
    (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const type = (error as { type?: string }).type;
      const status = type === 'entity.too.large' ? 413 : type === 'entity.parse.failed' ? 400 : 500;
      res.status(status).json({
        error:
          status === 500
            ? 'The server could not finish this request.'
            : 'The request could not be read.',
      });
    },
  );
  return app;
}
