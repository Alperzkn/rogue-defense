import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const DATA_PATH = path.resolve(
  import.meta.dirname,
  '../src/data/gameData.json',
);

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data: unknown) {
  const tmp = DATA_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  fs.renameSync(tmp, DATA_PATH);
}

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function matchRoute(url: string, pattern: string): Record<string, string> | null {
  const urlParts = url.split('/').filter(Boolean);
  const patParts = pattern.split('/').filter(Boolean);
  if (urlParts.length !== patParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = decodeURIComponent(urlParts[i]);
    } else if (patParts[i] !== urlParts[i]) {
      return null;
    }
  }
  return params;
}

async function handleApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url?.split('?')[0] ?? '';
  if (!url.startsWith('/api/')) return false;

  const method = req.method?.toUpperCase() ?? 'GET';
  const apiPath = url.slice(4); // strip /api

  try {
    // GET /api/data
    if (method === 'GET' && apiPath === '/data') {
      json(res, 200, readData());
      return true;
    }

    // --- Skills ---
    if (method === 'POST' && apiPath === '/skills') {
      const body = await parseBody(req);
      const data = readData();
      data.skills.push(body);
      writeData(data);
      console.log('[api] Created skill');
      json(res, 201, body);
      return true;
    }

    let params = matchRoute(apiPath, '/skills/:id');
    if (params) {
      const data = readData();
      const idx = data.skills.findIndex((s: { id: string }) => s.id === params!.id);
      if (method === 'PUT') {
        const body = await parseBody(req);
        if (idx === -1) data.skills.push(body);
        else data.skills[idx] = body;
        writeData(data);
        console.log('[api] Updated skill:', params.id);
        json(res, 200, body);
        return true;
      }
      if (method === 'DELETE') {
        if (idx === -1) { json(res, 404, { error: 'Skill not found' }); return true; }
        const refs = data.combos.filter((c: { skills: string[] }) => c.skills.includes(params!.id));
        data.skills.splice(idx, 1);
        writeData(data);
        console.log('[api] Deleted skill:', params.id);
        json(res, 200, { deleted: params.id, comboReferences: refs.map((c: { id: string }) => c.id) });
        return true;
      }
    }

    // --- Combos ---
    if (method === 'POST' && apiPath === '/combos') {
      const body = await parseBody(req);
      const data = readData();
      data.combos.push(body);
      writeData(data);
      console.log('[api] Created combo');
      json(res, 201, body);
      return true;
    }

    params = matchRoute(apiPath, '/combos/:id');
    if (params) {
      const data = readData();
      const idx = data.combos.findIndex((c: { id: string }) => c.id === params!.id);
      if (method === 'PUT') {
        const body = await parseBody(req);
        if (idx === -1) data.combos.push(body);
        else data.combos[idx] = body;
        writeData(data);
        console.log('[api] Updated combo:', params.id);
        json(res, 200, body);
        return true;
      }
      if (method === 'DELETE') {
        if (idx === -1) { json(res, 404, { error: 'Combo not found' }); return true; }
        data.combos.splice(idx, 1);
        writeData(data);
        console.log('[api] Deleted combo:', params.id);
        json(res, 200, { deleted: params.id });
        return true;
      }
    }

    // --- Chip Sockets ---
    params = matchRoute(apiPath, '/chipSockets/:id');
    if (params && method === 'PUT') {
      const body = await parseBody(req);
      const data = readData();
      const idx = data.chipSockets.findIndex((c: { id: string }) => c.id === params!.id);
      if (idx === -1) { json(res, 404, { error: 'Chip socket not found' }); return true; }
      data.chipSockets[idx] = body;
      writeData(data);
      console.log('[api] Updated chip socket:', params.id);
      json(res, 200, body);
      return true;
    }

    // --- Status Effects ---
    if (method === 'POST' && apiPath === '/statusEffects') {
      const body = await parseBody(req);
      const data = readData();
      data.statusEffects.push(body);
      writeData(data);
      console.log('[api] Created status effect');
      json(res, 201, body);
      return true;
    }

    params = matchRoute(apiPath, '/statusEffects/:id');
    if (params) {
      const data = readData();
      const idx = data.statusEffects.findIndex((s: { id: string }) => s.id === params!.id);
      if (method === 'PUT') {
        const body = await parseBody(req);
        if (idx === -1) data.statusEffects.push(body);
        else data.statusEffects[idx] = body;
        writeData(data);
        console.log('[api] Updated status effect:', params.id);
        json(res, 200, body);
        return true;
      }
      if (method === 'DELETE') {
        if (idx === -1) { json(res, 404, { error: 'Status effect not found' }); return true; }
        data.statusEffects.splice(idx, 1);
        writeData(data);
        console.log('[api] Deleted status effect:', params.id);
        json(res, 200, { deleted: params.id });
        return true;
      }
    }

    json(res, 404, { error: 'Not found' });
    return true;
  } catch (err) {
    console.error('[api] Error:', err);
    json(res, 500, { error: String(err) });
    return true;
  }
}

export function apiPlugin(): Plugin {
  return {
    name: 'rogue-defense-admin-api',
    configureServer(server) {
      // Register BEFORE Vite's internal middleware so the request body
      // is not consumed by Vite's transform pipeline
      server.middlewares.use((req, res, next) => {
        handleApi(req as IncomingMessage, res as ServerResponse).then(handled => {
          if (!handled) next();
        }).catch(err => {
          console.error('[api] Unhandled:', err);
          next();
        });
      });
    },
  };
}
