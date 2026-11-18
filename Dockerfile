# syntax=docker/dockerfile:1

FROM node:26.13.1-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 型チェック、単体テスト、配信用ファイルの一致確認を行います。
FROM deps AS check
COPY tsconfig.json tsconfig.node.json vitest.config.ts playwright.config.ts ./
COPY scripts ./scripts
COPY src ./src
COPY tests ./tests
COPY js ./js
CMD ["npm", "run", "check"]

FROM check AS build
RUN npm run build

# `docker build --target dist --output type=local,dest=js .` で js/ へ書き出します。
FROM scratch AS dist
COPY --from=build /app/dist/ /

# Playwright と Node.js のバージョンは package.json と揃えます。
FROM mcr.microsoft.com/playwright:v1.65.1-noble AS e2e
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.node.json playwright.config.ts ./
COPY tests/e2e ./tests/e2e
CMD ["npx", "playwright", "test"]

# 配信するファイルだけをコピーします。
FROM nginx:1.30.6-alpine AS web
COPY index.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY images /usr/share/nginx/html/images
COPY js /usr/share/nginx/html/js
