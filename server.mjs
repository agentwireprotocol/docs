// Production server: Astro's standalone handler, behind content negotiation
// (negotiate.mjs). Set ASTRO_NODE_AUTOSTART=disabled so the entry does not
// start its own server.
import http from 'node:http';
import { handler } from './dist/server/entry.mjs';
import { negotiate } from './negotiate.mjs';

const port = Number(process.env.PORT ?? 8080);
const host = process.env.HOST ?? '0.0.0.0';

http
  .createServer((req, res) => negotiate(req, res, () => handler(req, res)))
  .listen(port, host, () => console.log(`holler docs on http://${host}:${port}`));
