import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import path from 'node:path';
import { config, appRoot } from './config';
import { checkpoint } from './execution';
export const envelopeSchema = z
  .object({
    status: z.enum(['ok', 'empty', 'needs_input', 'partial', 'degraded', 'error']),
    results: z.array(z.unknown()).optional().default([]),
    summary: z.string().optional(),
    resolution: z.unknown().optional(),
    interpretation: z.unknown().optional(),
    provenance: z.unknown().optional(),
    error: z
      .object({ code: z.string(), retryable: z.boolean(), recovery: z.string().optional() })
      .passthrough()
      .optional(),
  })
  .passthrough();
export type Envelope = z.infer<typeof envelopeSchema>;
export const entitySchema = z
  .object({
    entity_id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string(),
    affinity: z.number().finite().optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();
export class ServiceError extends Error {
  constructor(
    public code: string,
    public retryable = false,
  ) {
    super(code);
  }
}
export function decodeEnvelope(raw: unknown): Envelope {
  const r = raw as { structuredContent?: unknown; content?: { type: string; text?: string }[] };
  const value =
    r.structuredContent ?? JSON.parse(r.content?.find((c) => c.type === 'text')?.text ?? 'null');
  const parsed = envelopeSchema.safeParse(value);
  if (!parsed.success) throw new ServiceError('QLOO_SCHEMA');
  const envelope = parsed.data;
  // /entities can omit type; Insights can use type="urn:entity" plus subtype.
  // Recover it only from the same ID/name's resolved interpretation, never
  // from the caller's requested domain or from ambiguous alternatives.
  const identity = z.object({ entityId: z.string().uuid(), name: z.string(), type: z.string() });
  const interpretation = z
    .object({
      entity: identity.optional(),
      options: z.array(identity).optional(),
    })
    .safeParse(envelope.interpretation);
  if (interpretation.success) {
    const identities = [
      ...(interpretation.data.entity ? [interpretation.data.entity] : []),
      ...(interpretation.data.options ?? []),
    ];
    envelope.results = envelope.results.map((raw) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
      const item = raw as Record<string, unknown>;
      if (item.type !== undefined && item.type !== 'urn:entity') return raw;
      const matches = identities.filter(
        (i) => i.entityId === item.entity_id && i.name === item.name,
      );
      const types = new Set(matches.map((i) => i.type));
      return types.size === 1 && (item.subtype === undefined || item.subtype === matches[0].type)
        ? { ...item, type: matches[0].type }
        : raw;
    });
  }
  return envelope;
}
export class Qloo {
  constructor(private fetcher: typeof fetch = fetch) {}
  private client?: Client;
  private connecting?: Promise<Client>;
  private transport?: StdioClientTransport;
  async connect() {
    if (this.client) return this.client;
    if (this.connecting) return this.connecting;
    this.connecting = (async () => {
      // The event-issued key is valid only on the hackathon endpoint. The
      // harness uses different environment names and requires explicit trust.
      const server = config.qlooServer.replace(/\/+$/, '');
      if (!['https://hackathon.api.qloo.com', 'https://api.qloo.com'].includes(server))
        throw new ServiceError('QLOO_ENDPOINT');
      const client = new Client({ name: 'heritage-bridge', version: '0.1.0' });
      const env: Record<string, string> = {};
      for (const key of ['PATH', 'SystemRoot', 'TEMP', 'TMP', 'USERPROFILE', 'HOME'])
        if (process.env[key]) env[key] = process.env[key]!;
      if (config.qlooKey) env.QLOO_API_KEY = config.qlooKey;
      env.QLOO_BASE_URL = server;
      env.QLOO_TRUSTED_BASE_URL = server;
      // Keep private harness traces and configuration inside the ignored app directory.
      env.QLOO_HOME = path.join(config.stateDir, 'qloo');
      this.transport = new StdioClientTransport({
        command: process.execPath,
        args: [path.join(appRoot, 'node_modules/@qloo/qloo-harness/dist/bin.js'), 'mcp'],
        cwd: appRoot,
        env,
        stderr: 'ignore',
      });
      try {
        await client.connect(this.transport, { timeout: config.timeout });
        this.client = client;
        return client;
      } catch {
        await this.transport.close();
        throw new ServiceError('QLOO_CONNECTION', true);
      }
    })();
    try {
      return await this.connecting;
    } finally {
      this.connecting = undefined;
    }
  }
  async tools() {
    return (await (await this.connect()).listTools()).tools;
  }
  async call(
    name: 'qloo_describe' | 'qloo_rank' | 'qloo_capabilities',
    args: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<Envelope> {
    checkpoint(signal);
    if (name === 'qloo_rank') return this.rankVerified(args, signal);
    const client = await this.connect();
    checkpoint(signal);
    try {
      return decodeEnvelope(
        await client.callTool({ name, arguments: args }, undefined, {
          timeout: config.timeout,
          signal,
          resetTimeoutOnProgress: false,
        }),
      );
    } catch (e) {
      checkpoint(signal);
      if (e instanceof ServiceError) throw e;
      throw new ServiceError('QLOO_TIMEOUT', true);
    }
  }
  private async rankVerified(
    args: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<Envelope> {
    const parsed = z
      .object({
        option_type: z.enum(['movie', 'artist']),
        options: z.array(z.string().uuid()).min(1).max(10),
        signals: z.array(z.string().uuid()).min(1).max(10),
      })
      .strict()
      .safeParse(args);
    if (!parsed.success) throw new ServiceError('QLOO_RANK_INPUT');
    const server = config.qlooServer.replace(/\/+$/, '');
    if (!['https://hackathon.api.qloo.com', 'https://api.qloo.com'].includes(server))
      throw new ServiceError('QLOO_ENDPOINT');
    const { option_type, options, signals } = parsed.data;
    const url = new URL('/v2/insights', server);
    url.search = new URLSearchParams({
      'filter.type': 'urn:entity:' + option_type,
      'filter.results.entities': options.join(','),
      'signal.interests.entities': signals.join(','),
      take: String(options.length),
    }).toString();
    // The backend already verified every ID. A single official Insights query
    // avoids the MCP resolver's parallel rehydration of the same identities.
    let response: Response;
    try {
      response = await this.fetcher(url, {
        headers: { 'X-Api-Key': config.qlooKey, Accept: 'application/json' },
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(config.timeout)])
          : AbortSignal.timeout(config.timeout),
        redirect: 'error',
      });
    } catch {
      checkpoint(signal);
      throw new ServiceError('QLOO_TIMEOUT', true);
    }
    if (!response.ok)
      throw new ServiceError(
        response.status === 429
          ? 'QLOO_RATE_LIMIT'
          : [401, 403].includes(response.status)
            ? 'QLOO_AUTH'
            : 'QLOO_UPSTREAM',
        response.status === 429 || response.status >= 500,
      );
    const payload = z
      .object({ results: z.object({ entities: z.array(z.unknown()) }) })
      .safeParse(await response.json());
    if (!payload.success) throw new ServiceError('QLOO_SCHEMA');
    return {
      status: 'ok',
      results: payload.data.results.entities.map((raw) => {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
        const entity = raw as Record<string, unknown>;
        if (entity.subtype !== undefined && entity.subtype !== 'urn:entity:' + option_type)
          return { ...entity, type: 'unverified' };
        const query = z
          .object({ affinity: z.number().finite().optional() })
          .safeParse(entity.query);
        const typed =
          entity.type === 'urn:entity' && entity.subtype === 'urn:entity:' + option_type
            ? { ...entity, type: entity.subtype }
            : entity;
        // Require the response's own subtype; never assign type from the request.
        return {
          ...typed,
          affinity: entity.affinity ?? (query.success ? query.data.affinity : undefined),
        };
      }),
      provenance: { endpoint: '/v2/insights', method: 'GET', boundedOptions: options.length },
    };
  }
  async close() {
    await this.client?.close();
    this.client = undefined;
  }
}
