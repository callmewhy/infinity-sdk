FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install -g turbo && \
    turbo prune core --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat openssl python3 make g++ linux-headers eudev-dev build-base
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/packages/db/prisma/ ./packages/db/prisma/
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm turbo build --filter=core...

FROM base AS runner
WORKDIR /app

RUN apk add --no-cache curl openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=installer /app .
RUN chown -R nodejs:nodejs .

USER nodejs
ENV NODE_ENV=production
