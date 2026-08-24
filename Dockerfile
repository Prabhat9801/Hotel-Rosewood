# Build the static site
FROM node:24-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY artifacts/hotel-rosewood/package.json artifacts/hotel-rosewood/package.json
COPY lib/api-client-react/package.json lib/api-client-react/package.json

# The repo's own preinstall script blocks plain `npm install`, which has no
# meaning inside this image — pnpm is the only thing that ever runs here.
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));delete p.scripts.preinstall;fs.writeFileSync('package.json',JSON.stringify(p,null,2));"

# pnpm 11 exits non-zero here purely to flag esbuild's postinstall as
# skipped (the packages are still installed correctly); `approve-builds`
# actually runs it next. node_modules must exist afterward or this was a
# real install failure, not just the ignored-builds warning.
RUN pnpm install --frozen-lockfile --filter @workspace/hotel-rosewood... || test -d node_modules
RUN pnpm approve-builds --all

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
