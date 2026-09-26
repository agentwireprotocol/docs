import type { APIRoute } from 'astro';
import { TYPESAFE_API_KEY } from 'astro:env/server';
import { createJevSearchHandler } from '@/lib/jev-search-server';
import { searchDocuments } from '@/lib/search-documents';

export const prerender = false;

let handler: ((request: Request) => Promise<Response>) | undefined;

export const GET: APIRoute = ({ request }) => {
  if (!handler) {
    if (!TYPESAFE_API_KEY) console.warn('jev-search: TYPESAFE_API_KEY is not set, so search ranks by keyword only');
    handler = createJevSearchHandler({ documents: searchDocuments(), apiKey: TYPESAFE_API_KEY });
  }
  return handler(request);
};
