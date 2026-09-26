import { isMarkdownPreferred } from 'fumadocs-core/negotiation';

// Content negotiation for docs pages: a request that prefers Markdown
// (Accept: text/markdown, as agents send) gets the page's Markdown instead of
// its HTML, from the same URL. Pages are prerendered, so this runs in front of
// Astro: in server.mjs in production, and as a Vite middleware in dev.

const skip = /^\/(?:api|_astro|og)\/|\.[a-z0-9]+$/i;

/**
 * The Markdown path for a request that should get Markdown, or undefined:
 * / → /index.md, /guides/watching → /guides/watching.md.
 */
export function markdownRewrite(method, url, accept) {
  if (method !== 'GET' && method !== 'HEAD') return;
  const [pathname, query] = splitQuery(url);
  if (skip.test(pathname)) return;
  if (!isMarkdownPreferred(new Request('http://docs' + pathname, { headers: { accept: accept ?? '' } }))) return;
  const trimmed = pathname.replace(/\/+$/, '');
  return `${trimmed || '/index'}.md${query}`;
}

/** Connect-style middleware: rewrites req.url and marks every page response Vary: Accept. */
export function negotiate(req, res, next) {
  const [pathname] = splitQuery(req.url ?? '/');
  if (!skip.test(pathname)) res.setHeader('Vary', 'Accept');
  const rewritten = markdownRewrite(req.method, req.url ?? '/', req.headers.accept);
  if (rewritten) req.url = rewritten;
  next();
}

function splitQuery(url) {
  const i = url.indexOf('?');
  return i < 0 ? [url, ''] : [url.slice(0, i), url.slice(i)];
}
