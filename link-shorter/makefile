# Переменные
BINARY_NAME=link-shorter
MAIN_PATH=./cmd
BUILD_DIR=./tmp
MIGRATIONS_DIR=./migrations

# Цвета для вывода
GREEN=\033[0;32m
NC=\033[0m # No Color

.PHONY: all build run dev clean test migrate-up migrate-down docker-up docker-down help

# Основные команды
all: clean build

build:
	@echo "$(GREEN)Building application...$(NC)"
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)

run: build
	@echo "$(GREEN)Running application...$(NC)"
	@./$(BUILD_DIR)/$(BINARY_NAME)

dev:
	@echo "$(GREEN)Starting development server with hot reload...$(NC)"
	@air

clean:
	@echo "$(GREEN)Cleaning build directory...$(NC)"
	@rm -rf $(BUILD_DIR)/*

# Тесты
test:
	@echo "$(GREEN)Running tests...$(NC)"
	@go test -v ./...

# Миграции
migrate-up:
	@echo "$(GREEN)Running database migrations up...$(NC)"
	@go run $(MIGRATIONS_DIR)/auto.go

migrate-dropup:
	@echo "$(GREEN)Running database migrations down...$(NC)"
	@go run $(MIGRATIONS_DIR)/auto.go --drop

# Docker команды
docker-up:
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	@docker-compose up -d

docker-down:
	@echo "$(GREEN)Stopping Docker containers...$(NC)"
	@docker-compose down

# Зависимости
deps:
	@echo "$(GREEN)Downloading dependencies...$(NC)"
	@go mod download

# Помощь
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "  make build        - Build the application"
	@echo "  make run         - Build and run the application"
	@echo "  make dev         - Start development server with hot reload"
	@echo "  make clean       - Clean build directory"
	@echo "  make test        - Run tests"
	@echo "  make migrate-up  - Run database migrations up"
	@echo "  make migrate-down - Rollback database migrations"
	@echo "  make docker-up   - Start Docker containers"
	@echo "  make docker-down - Stop Docker containers"
	@echo "  make deps        - Download dependencies"
	@echo "  make help        - Show this help message"