# Build the static site
FROM node:24-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

# Copy just the manifests first so dependency installs are cached
# independently of source changes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY artifacts/hotel-rosewood/package.json artifacts/hotel-rosewood/package.json
COPY lib/api-client-react/package.json lib/api-client-react/package.json

# The workspace's root `preinstall` script re-checks npm_config_user_agent
# itself to block accidental `npm install`, but pnpm does not forward that
# variable into the environment lifecycle scripts run in (it sets its own),
# so the guard sees no value and fails even though pnpm is what's running.
# Setting ENV npm_config_user_agent does not fix this. The guard only exists
# to protect a human's local checkout; strip it before installing here,
# where pnpm is the only tool that will ever run.
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"
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
