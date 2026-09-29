import type { StaticSource } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import type { Item, Node, Root } from 'fumadocs-core/page-tree';
import { type CollectionEntry, getCollection } from 'astro:content';
import * as path from 'node:path';
import { structure, type StructuredData } from 'fumadocs-core/mdx-plugins';

// The content has two root folders, which the sidebar shows as tabs: docs/
// and reference/. The docs folder is the site itself, so its name stays out
// of the URLs: content/docs/docs/concepts/threads.mdx is /concepts/threads.
export const source = loader({
  source: await createMySource(),
  baseUrl: '/',
  slugs(file, next) {
    const slugs = next();
    return slugs[0] === 'docs' ? slugs.slice(1) : slugs;
  },
});

// The sidebar calls the home page "Introduction"; the page itself keeps its
// title, "Agent Wire Protocol".
export function pageTree(): Root {
  const tree = source.getPageTree();
  const rename = (node: Node): Node => {
    if (node.type === 'page') return node.url === '/' ? { ...node, name: 'Introduction' } : node;
    if (node.type === 'folder') {
      return { ...node, index: node.index && (rename(node.index) as Item), children: node.children.map(rename) };
    }
    return node;
  };
  return { ...tree, children: tree.children.map(rename) };
}

export function getStructuredData(entry: CollectionEntry<'docs'>): StructuredData {
  return structure(entry.body);
}

async function createMySource() {
  const out: StaticSource<{
    metaData: CollectionEntry<'meta'>['data'];
    pageData: CollectionEntry<'docs'>['data'] & {
      _raw: CollectionEntry<'docs'>;
    };
  }> = {
    files: [],
  };

  for (const page of await getCollection('docs')) {
    const virtualPath = path.relative('content/docs', page.filePath!);

    out.files.push({
      type: 'page',
      path: virtualPath,
      data: {
        ...page.data,
        _raw: page,
      },
    });
  }

  for (const meta of await getCollection('meta')) {
    const virtualPath = path.relative('content/docs', meta.filePath!);

    out.files.push({
      type: 'meta',
      path: virtualPath,
      data: meta.data,
    });
  }

  return out;
}
