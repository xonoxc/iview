COMPOSE := docker compose
DEV := -f docker-compose.yml -f docker-compose.dev.yml
PROD := -f docker-compose.yml -f docker-compose.prod.yml

MIGRATIONS := ./apps/api/migrations
DB_URL := postgres://iview:iview@localhost:5432/iview?sslmode=disable

.PHONY: dev dev-build prod prod-build down clean logs ps \
        migration migrate-up migrate-down migrate-status

# Development
dev:
	$(COMPOSE) $(DEV) up

dev-build:
	$(COMPOSE) $(DEV) up --build

# Production
prod:
	$(COMPOSE) $(PROD) up -d

prod-build:
	$(COMPOSE) $(PROD) up -d --build

# Common
down:
	$(COMPOSE) $(DEV) down

logs:
	$(COMPOSE) $(DEV) logs -f

ps:
	$(COMPOSE) $(DEV) ps

clean:
	$(COMPOSE) $(DEV) down -v --remove-orphans

# Migrations
migration:
	goose -dir $(MIGRATIONS) create $(name) sql

migrate-up:
	goose -dir $(MIGRATIONS) postgres "$(DB_URL)" up

migrate-down:
	goose -dir $(MIGRATIONS) postgres "$(DB_URL)" down

migrate-status:
	goose -dir $(MIGRATIONS) postgres "$(DB_URL)" status
