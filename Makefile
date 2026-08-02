COMPOSE := docker compose
DEV := -f docker-compose.yml -f docker-compose.dev.yml
PROD := -f docker-compose.yml -f docker-compose.prod.yml

.PHONY: dev dev-build prod prod-build down clean logs ps

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

# Remove containers + volumes
clean:
	$(COMPOSE) $(DEV) down -v --remove-orphans
