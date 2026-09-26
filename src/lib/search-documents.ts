// The search index, built from Fumadocs' own view of the content: each page
// is a document, and so is each of its headings, with the exact anchors the
// page renders. It is built on the first search and kept in memory.
import type { SearchDocument } from '@/lib/jev-search-core';
import { getStructuredData, source } from '@/lib/source';

let cached: SearchDocument[] | undefined;

// Structured data keeps markdown's backslash escapes ("1\. Connect").
function unescape(text: string): string {
  return text.replace(/\\([\\`*_{}\[\]()#+\-.!|<>])/g, '$1');
}

export function searchDocuments(): SearchDocument[] {
  if (cached) return cached;
  const docs: SearchDocument[] = [];
  const tree = source.getPageTree();
  // The top-level sidebar group a page sits in, e.g. "Getting started".
  const sections = new Map<string, string>();
  let current: string | undefined;
  for (const node of tree.children) {
    if (node.type === 'separator') current = String(node.name ?? '');
    else if (node.type === 'folder') walk(node, String(node.name ?? current ?? ''));
    else if (node.type === 'page' && current) sections.set(node.url, current);
  }
  function walk(node: (typeof tree.children)[number], section: string) {
    if (node.type === 'page') sections.set(node.url, section);
    if (node.type === 'folder') {
      if (node.index) sections.set(node.index.url, section);
      node.children.forEach((child) => walk(child, section));
    }
  }

  for (const page of source.getPages()) {
    const data = getStructuredData(page.data._raw);
    const section = sections.get(page.url);
    const intro = data.contents.filter((c) => !c.heading).map((c) => c.content);
    docs.push({
      id: page.url,
      title: page.data.title,
      url: page.url,
      description: page.data.description,
      content: unescape(intro.join(' ')),
      section,
    });
    for (const heading of data.headings) {
      const text = data.contents.filter((c) => c.heading === heading.id).map((c) => c.content);
      docs.push({
        id: `${page.url}#${heading.id}`,
        title: unescape(heading.content),
        url: `${page.url}#${heading.id}`,
        description: page.data.title,
        content: unescape(text.join(' ')),
        section,
      });
    }
  }
  cached = docs;
  return docs;
}
