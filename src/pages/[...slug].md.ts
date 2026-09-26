import type { APIRoute, GetStaticPaths } from 'astro';
import { source } from '@/lib/source';
import { docsLlms, markdownUrl } from '@/lib/llms';

// Each page as Markdown: /index.md for the home page, /<slug>.md for the rest.
export const getStaticPaths = (() =>
  source.getPages().map((page) => ({
    params: { slug: markdownUrl(page).slice(1, -'.md'.length) },
    props: { slugs: page.slugs },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const page = source.getPage(props.slugs as string[])!;
  return new Response(await docsLlms.page(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
