# iview

A monorepo for the iview project: a Go API, a Next.js web app, and shared TypeScript packages, orchestrated with pnpm, Turborepo, and Docker Compose.

## Stack

- **Web** — [Next.js 16](https://nextjs.org/) (React 19, Turbopack) app
- **API** — [Go](https://go.dev/) 1.26 HTTP server (stdlib `net/http` router) with a [pgx](https://github.com/jackc/pgx) PostgreSQL driver
- **DB** — PostgreSQL 17
- **Tooling** — [pnpm](https://pnpm.io/) + [Turborepo](https://turborepo.dev/) workspaces, [Docker Compose](https://docs.docker.com/compose/) for local/prod environments, [goose](https://pressly.github.io/goose/) for migrations, [air](https://github.com/air-verse/air) for API hot reload

## Repository layout

```
apps/
  api/             # Go API service
    cmd/api/       # entrypoint (main.go, app.go)
    internal/
      config/      # env config loading
      database/    # pgx/postgres connection
      domain/      # domain models
      repositories/# data access
      services/    # business logic
      handlers/    # HTTP handlers
      router/      # route registration
      server/      # HTTP server
    migrations/    # goose SQL migrations
  web/             # Next.js app
packages/
  ui/              # @repo/ui — shared React components
  eslint-config/   # @repo/eslint-config — shared ESLint configs
  typescript-config/# @repo/typescript-config — shared tsconfigs
```

## Prerequisites

- Docker + Docker Compose
- Go 1.26+ (to run the API outside Docker or use the Makefile migration targets)
- [goose](https://pressly.github.io/goose/installation) (for the `migration`/`migrate-*` Makefile targets)

## Getting started

```sh
make dev
```

This builds and runs all services via Docker Compose:

| Service   | URL                    | Notes                              |
| --------- | ---------------------- | ---------------------------------- |
| web       | http://localhost:3000  | Next.js dev server (hot reload)    |
| api       | http://localhost:8080  | Go API (air hot reload)            |
| postgres  | localhost:5432         | `iview` / `iview` / `iview`        |

Rebuild images after dependency changes with `make dev-build`.

## API

Routes (see `apps/api/internal/router/router.go`):

- `POST /rooms` — create a room
- `GET /rooms/{id}` — get a room by ID

Configuration is read from the environment (see `apps/api/.env.sample`):

- `DATABASE_URL` (required) — e.g. `postgres://iview:iview@postgres:5432/iview?sslmode=disable`
- `API_PORT` — e.g. `:8080` (defaults to `:8080`)

## Migrations

Migrations live in `apps/api/migrations` and run against `localhost:5432` by default.

```sh
make migration name=create_rooms   # create a new migration file
make migrate-up                    # apply all pending migrations
make migrate-down                  # roll back the last migration
make migrate-status                # show migration status
```

## Useful commands

```sh
make dev          # start dev stack (foreground)
make dev-build    # start dev stack, rebuilding images
make prod         # start production stack (detached)
make prod-build   # start production stack, rebuilding images
make down         # stop dev stack
make clean        # stop dev stack and remove volumes
make logs         # tail dev logs
make ps           # list dev services
```

Run task commands (build/lint/typecheck) per package with turbo:

```sh
pnpm build            # turbo run build
pnpm --filter web dev # dev only the web app on the host
```
