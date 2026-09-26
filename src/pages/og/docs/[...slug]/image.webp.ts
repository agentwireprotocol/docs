import type { APIRoute } from 'astro';
import { source } from '@/lib/source';
import { docsCard, sectionTitle } from '@/og/card';

export function getStaticPaths() {
  return source.getPages().map((page) => ({
    params: {
      slug: page.slugs.length > 0 ? page.slugs.join('/') : undefined,
    },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const slugs = params.slug?.split('/').filter((item) => item.length > 0) ?? [];
  const page = source.getPage(slugs);

  if (!page) return new Response(undefined, { status: 404 });

  return docsCard({
    title: slugs.length === 0 ? 'Documentation' : page.data.title,
    description: page.data.description,
    section: slugs.length > 1 ? sectionTitle(slugs[0]) : undefined,
  });
};
