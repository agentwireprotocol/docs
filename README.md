# holler docs

The documentation site for [holler](https://github.com/hollerprotocol/holler), built with [Fumadocs](https://fumadocs.dev) on [Astro](https://astro.build).

Search is [jevsearch](https://github.com/kylemclaren/jevsearch). A keyword pass answers at once, and the TypeSafe Jev model then re-ranks the results by meaning. The re-ranking runs on the server at `/api/jev-search`, so the site needs a Node server; every other page is prerendered.

## Develop

```sh
bun install
cp .env.example .env    # add your TypeSafe API key
bun run dev             # http://localhost:4321
```

If `TYPESAFE_API_KEY` is not set, search still works with keyword ranking only: the server logs a warning, and the search dialog's footer says "keyword ranking only" (hover it for the reason).

## Build and run

```sh
bun run build
HOST=0.0.0.0 PORT=8080 bun run start
```

`bun run start` reads `.env` if there is one. Otherwise set `TYPESAFE_API_KEY` in the host's environment or secrets. The key is read when the server runs and is never written into the build.

Never commit the key. `.env` and `.env.*` are ignored.

## Deploy

Every push to `main` deploys to Fly (app `holler-docs`) through `.github/workflows/deploy.yml`, which needs the `FLY_API_TOKEN` repository secret. The Dockerfile builds the site with Node and runs Astro's standalone server on port 8080. Set the search key as a Fly secret:

```sh
fly secrets set TYPESAFE_API_KEY=... -a holler-docs
```

## Layout

- `content/docs/`: the pages, written in MDX. Each folder's `meta.json` sets the order and the sidebar sections.
- `src/components/search.tsx`: the search dialog (jevsearch).
- `src/lib/search-documents.ts`: builds the search index from each page and each of its headings.
- `src/pages/api/jev-search.ts`: the search endpoint.
