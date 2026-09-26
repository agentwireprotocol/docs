// jevsearch's endpoint: keyword hits streamed at once, then Jev's ranking.
// It runs on the server (it holds TYPESAFE_API_KEY), not prerendered.
import type { APIRoute } from 'astro';
import { createJevSearchHandler } from '@/lib/jev-search-server';
import { searchDocuments } from '@/lib/search-documents';

export const prerender = false;

let handler: ((request: Request) => Promise<Response>) | undefined;

export const GET: APIRoute = ({ request }) => {
  handler ??= createJevSearchHandler({ documents: searchDocuments() });
  return handler(request);
};
