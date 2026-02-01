.PHONY: dev build start stop clean install help

# Auto-install dependencies if node_modules missing
node_modules:
	@bun install

dev: node_modules ## Start development server
	@bun run dev

build: node_modules ## Build for production
	@bun run build

start: node_modules build ## Start production server
	@bun run start

stop: ## Stop server
	@pkill -f "next" 2>/dev/null || true

clean: ## Clean build files
	@rm -rf .next out

lint: node_modules ## Run linter
	@bun run lint

help: ## Show commands
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-10s %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
