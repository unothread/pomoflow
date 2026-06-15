# syntax=docker/dockerfile:1.7

# ─── deps ──────────────────────────────────────────────────────────────────
# Install dependencies with a full toolchain so any package that needs
# native build (e.g. sharp) can compile. We keep devDependencies because
# Next's build step reads them (eslint config, postcss, etc.).
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# ca-certificates is needed for HTTPS fetches during build.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# `ci` is reproducible and fails fast if the lockfile is out of sync.
# Fall back to `install` for the very first build if no lockfile exists.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ─── builder ───────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ─── runner ────────────────────────────────────────────────────────────────
# Final image: only the standalone output + public/static + node_modules
# subset. Runs as the unprivileged `nextjs` user that ships with the
# official Next standalone output.
FROM node:20-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create the same user the standalone build expects.
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --create-home --shell /bin/bash nextjs

# Standalone output bundles a minimal server.js and node_modules tree.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Coolify's healthcheck can hit this.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
