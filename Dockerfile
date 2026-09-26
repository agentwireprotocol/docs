# The docs: pages prerendered at build time, served by Astro's standalone Node
# server, which also answers /api/jev-search (it needs TYPESAFE_API_KEY, a
# Fly secret, at runtime; the build never sees it).
FROM node:24-slim AS build
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN node ./node_modules/astro/bin/astro.mjs build

FROM node:24-slim AS deps
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/server/entry.mjs"]
