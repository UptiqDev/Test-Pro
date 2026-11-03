# ---- Stage 1: Build ----
FROM node:22-bookworm AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false
COPY . .
RUN yarn build

# ---- Stage 2: Runtime ----
FROM node:22-alpine AS runtime

RUN apk upgrade --no-cache

ARG VERSION=
ENV VERSION=$VERSION

WORKDIR /app

# Reinstall prod-only deps
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000
ENTRYPOINT ["yarn", "run", "start:dist"]
