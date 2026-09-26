// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import compression from 'compression';
import { negotiate } from './negotiate.mjs';
import { unified } from '@astrojs/markdown-remark';
import {
  rehypeCode,
  remarkCodeTab,
  remarkHeading,
  remarkNpm,
  remarkStructure,
} from 'fumadocs-core/mdx-plugins';

const remarkPlugins = [
  remarkHeading,
  remarkCodeTab,
  remarkNpm,
  [remarkStructure, { exportAs: 'structuredData' }],
];
const rehypePlugins = [rehypeCode];

// Gzip the dev server's responses. Dev serves unbundled, unminified modules,
// megabytes of JavaScript per page, which crawl over a remote connection such
// as `sprite proxy`. The search endpoint streams its results, so it is left
// alone.
function compressDev() {
  return {
    name: 'holler-docs:compress-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(
        compression({ filter: (req, res) => !req.url?.startsWith('/api/') && compression.filter(req, res) }),
      );
    },
  };
}

// Serve a page's Markdown to requests that prefer it, as server.mjs does in
// production.
function negotiateDev() {
  return {
    name: 'holler-docs:negotiate-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(negotiate);
    },
  };
}

export default defineConfig({
  // The public origin: social cards need absolute image URLs.
  site: 'https://holler-docs.fly.dev',
  site: 'https://holler-docs.fly.dev',
  // Pages are prerendered; only /api/jev-search runs on the server, since it
  // holds the TypeSafe key.
  adapter: node({ mode: 'standalone' }),
  // The TypeSafe key for search. A server secret: read from .env in dev and
  // from the environment at runtime, never written into the build. Without
  // it, search ranks by keyword only.
  env: {
    schema: {
      TYPESAFE_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  markdown: {
    processor: unified({
      syntaxHighlight: false,
      remarkPlugins,
      rehypePlugins,
    }),
  },
  integrations: [
    react(),
    mdx({
      extendMarkdownConfig: true,
      syntaxHighlight: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss(), compressDev(), negotiateDev()],
    server: {
      // Transform the page and its island up front, so the first load after
      // the dev server starts does not wait on them.
      warmup: {
        ssrFiles: ['./src/pages/**/*.astro'],
        clientFiles: ['./src/components/docs.tsx'],
      },
    },
  },
});
