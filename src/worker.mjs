// Gold Shore Matter Atlas — scaffold for the next revision of the isolated Worker.
// In production, configure a Workers Static Assets binding named ASSETS.
// This module intentionally has no privileged GS-API or D1 access.
import { ELEMENTS } from './elements.mjs';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
  },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'method_not_allowed' }, 405);
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return json({ status: 'ok', application: 'goldshore-matter-atlas', count: ELEMENTS.length, version: '0.1.0' });
    }
    if (url.pathname === '/api/v1/elements') {
      return json({ count: ELEMENTS.length, elements: ELEMENTS, provenance: 'baseline identity and periodic position only' });
    }
    const match = url.pathname.match(/^\/api\/v1\/elements\/(\d+)$/);
    if (match) {
      const element = ELEMENTS[Number(match[1]) - 1];
      return element ? json({ element, status: 'baseline_only' }) : json({ error: 'not_found' }, 404);
    }
    if (!env.ASSETS) return json({ error: 'assets_binding_not_configured' }, 503);
    return env.ASSETS.fetch(request);
  },
};
