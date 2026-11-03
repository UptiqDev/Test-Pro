# Test Pro Backend

Minimal Node.js + TypeScript + Express service, structured like `alpha-cash-backend`.

## Stack

Node 22 · TypeScript (ESM) · Express 5 · Zod · tsx · Vitest · Prettier · Yarn · Docker

## Run with Docker (local, hot reload)

```bash
cp .env.example .env.local
docker compose -f docker-compose.local.yaml up --build
# port 3000 taken? HOST_PORT=3100 docker compose -f docker-compose.local.yaml up --build
```

## Run production image

```bash
docker build -t test-pro .
docker run --rm -p 3000:3000 test-pro
```

## Run without Docker

```bash
yarn install
ENV=local yarn start   # tsx watch
yarn test              # vitest
yarn build             # tsc + tsc-alias -> dist/
```

## Endpoints

| Method | Path         | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/`          | Hello message            |
| GET    | `/v1/health` | Health check             |
| POST   | `/v1/greet`  | Body `{ "name": "..." }` |

## Layout

```
src/
  index.ts              entry: reads env, calls server.start()
  server.ts             express app + error handling
  router/v1/            versioned routers
  error/                ErrorCode + ErrorWithCode
  modules/health/
    main.ts             business logic
    server.schema.ts    zod schemas
    server.controller.ts
    server.routes.ts
    __tests__/
```
