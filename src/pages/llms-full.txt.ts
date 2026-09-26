import type { APIRoute } from 'astro';
import { docsLlms } from '@/lib/llms';

export const GET: APIRoute = async () =>
  new Response(await docsLlms.full(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
