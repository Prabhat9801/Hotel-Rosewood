# Build the static site
FROM node:24-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

# Copy just the manifests first so dependency installs are cached
# independently of source changes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY artifacts/hotel-rosewood/package.json artifacts/hotel-rosewood/package.json
COPY lib/api-client-react/package.json lib/api-client-react/package.json

RUN pnpm install --frozen-lockfile --filter @workspace/hotel-rosewood...

COPY artifacts/hotel-rosewood artifacts/hotel-rosewood
COPY lib/api-client-react lib/api-client-react

ENV PORT=5173
ENV BASE_PATH=/
RUN pnpm --filter @workspace/hotel-rosewood run build

# Serve the built static files
FROM node:24-slim AS run
WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/artifacts/hotel-rosewood/dist/public ./public

EXPOSE 10000
CMD ["serve", "-s", "public", "-l", "10000"]
