import { unified } from 'unified';
import { VFile } from 'vfile';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';
import { remarkLLMs } from 'fumadocs-core/mdx-plugins/remark-llms';
import { llms } from 'fumadocs-core/source/llms';
import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { defaultHandlers } from 'mdast-util-to-markdown';
import { source } from './source';

// Markdown for LLMs and agents: /llms.txt, /llms-full.txt, each page as
// /<page>.md, and the page itself when a request prefers text/markdown
// (see negotiate.mjs). https://www.fumadocs.dev/docs/integrations/llms

// astro.config.mjs `site`.
export const siteUrl = import.meta.env.SITE.replace(/\/$/, '');
export const docsRepoUrl = 'https://github.com/hollerprotocol/docs';

type Page = ReturnType<typeof source.getPages>[number];

/** The page's Markdown URL: /index.md for the home page, /guides/watching.md for the rest. */
export function markdownUrl(page: { slugs: string[] }) {
  return `/${page.slugs.length > 0 ? page.slugs.join('/') : 'index'}.md`;
}

/** The page's source file in the docs repository. */
export function githubUrl(page: Page) {
  return `${docsRepoUrl}/blob/main/content/docs/${page.path}`;
}

function attr(node: MdxJsxFlowElement, name: string) {
  const found = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  return typeof found?.value === 'string' ? found.value : undefined;
}

const calloutLabel: Record<string, string> = { info: 'Note', warn: 'Warning', error: 'Important' };

const processor = unified()
  .data('settings', { bullet: '-' })
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkHeading)
  .use(remarkLLMs, {
    _data: true,
    headingIds: false,
    handlers: {
      // Site links absolute, so they work outside the site.
      link(node, parent, state, info) {
        const url = node.url.startsWith('/') ? siteUrl + node.url : node.url;
        return defaultHandlers.link({ ...node, url }, parent, state, info);
      },
    },
    // The site's components, as plain Markdown: a callout becomes a labelled
    // quote, a card a link with its blurb.
    stringify(node, _parent, state, info) {
      if (node.type !== 'mdxJsxFlowElement') return;
      if (node.name === 'Callout') {
        const label = calloutLabel[attr(node, 'type') ?? 'info'] ?? 'Note';
        const body = state.containerFlow(node, info).trim();
        return `**${label}:** ${body}`
          .split('\n')
          .map((line) => (line ? `> ${line}` : '>'))
          .join('\n');
      }
      if (node.name === 'Cards') {
        return node.children.map((child) => state.handle(child, node, state, info)).join('\n');
      }
      if (node.name === 'Card') {
        const title = attr(node, 'title') ?? '';
        const href = attr(node, 'href');
        const blurb = state.containerFlow(node, info).trim().replace(/\s*\n\s*/g, ' ');
        const link = href ? `[${title}](${siteUrl}${href})` : title;
        return `- ${link}${blurb ? `: ${blurb}` : ''}`;
      }
    },
  });

/** One page as Markdown: its title, description and URL, then the content. */
export async function renderPageMarkdown(page: Page) {
  // Only the transforms: remarkLLMs leaves the Markdown in file.data.
  const file = new VFile({ value: page.data._raw.body ?? '', path: page.path });
  await processor.run(processor.parse(file), file);
  const content = String(file.data.markdown ?? '').trim();
  const head = [`# ${page.data.title}`];
  if (page.data.description) head.push('', `> ${page.data.description}`);
  head.push('', `Source: ${new URL(page.url, siteUrl).href}`);
  return `${head.join('\n')}\n\n${content}\n`;
}

export const docsLlms = llms(source, { renderPage: renderPageMarkdown });

/** llms.txt (https://llmstxt.org): the page tree as links to each page's Markdown. */
export async function llmsIndex() {
  const home = source.getPage([]);
  const index = (await docsLlms.index())
    // Sidebar separators become sections.
    .replace(/^\s*- \*\*(.+)\*\*$/gm, '\n## $1\n')
    // The home page is the introduction; its description is the summary.
    .replace(/^- \[holler\]\(\/\)(: .*)?$/m, '- [Introduction](/)')
    // Point the links at the Markdown, which is what an agent reading this wants.
    .replace(/\]\((\/[^)]*)\)/g, (_m, url: string) => {
      const page = source.getPages().find((p) => p.url === url);
      return `](${siteUrl}${page ? markdownUrl(page) : url})`;
    })
    .replace(/^# .*\n/, (title) => `${title}\n> ${home?.data.description ?? ''}\n`)
    .replace(/\n{3,}/g, '\n\n');
  return `${index.trim()}

## Optional

- [Everything in one file](${siteUrl}/llms-full.txt): every page above, as Markdown
- [Specification](https://github.com/hollerprotocol/holler/blob/main/SPEC.md): the holler protocol, draft 1
`;
}
