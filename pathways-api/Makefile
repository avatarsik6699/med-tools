# Docker commands for development

.PHONY: help docker-up docker-down docker-logs docker-restart docker-build docker-clean setup

# Default target
help:
	@echo "Available Docker commands:"
	@echo "  docker-up      - Start Docker services"
	@echo "  docker-down    - Stop Docker services"
	@echo "  docker-logs    - View Docker logs"
	@echo "  docker-restart - Restart Docker services"
	@echo "  docker-build   - Rebuild Docker services"
	@echo "  docker-clean   - Stop and remove containers, networks, and volumes"
	@echo "  setup          - Initial setup (start services)"

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-build:
	docker-compose up -d --build

docker-clean:
	docker-compose down -v --remove-orphans

# Setup
setup: docker-up
	@echo "Docker services started!"

