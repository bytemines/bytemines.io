# Makefile for bytemines.io
# Next.js project with Bun package manager

.PHONY: help install dev start stop restart build clean lint type-check test logs status rebuild fresh

# Default target
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

# Project configuration
PORT := 4321
PID_FILE := .next-server.pid

#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

help: ## Show this help message
	@echo ""
	@echo "$(CYAN)bytemines.io - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

#------------------------------------------------------------------------------
# Installation
#------------------------------------------------------------------------------

install: ## Install dependencies
	@echo "$(CYAN)Installing dependencies...$(NC)"
	@bun install
	@echo "$(GREEN)Dependencies installed successfully$(NC)"

#------------------------------------------------------------------------------
# Development
#------------------------------------------------------------------------------

dev: ## Start development server (port 4321)
	@echo "$(CYAN)Starting development server on port $(PORT)...$(NC)"
	@bun run dev

start: ## Start production server
	@echo "$(CYAN)Starting production server...$(NC)"
	@if [ -f $(PID_FILE) ]; then \
		echo "$(YELLOW)Server already running (PID: $$(cat $(PID_FILE)))$(NC)"; \
	else \
		bun run start & echo $$! > $(PID_FILE); \
		echo "$(GREEN)Server started (PID: $$(cat $(PID_FILE)))$(NC)"; \
	fi

stop: ## Stop production server
	@echo "$(CYAN)Stopping server...$(NC)"
	@if [ -f $(PID_FILE) ]; then \
		kill $$(cat $(PID_FILE)) 2>/dev/null || true; \
		rm -f $(PID_FILE); \
		echo "$(GREEN)Server stopped$(NC)"; \
	else \
		echo "$(YELLOW)No server running$(NC)"; \
		pkill -f "next start" 2>/dev/null || true; \
	fi

restart: stop start ## Restart production server

status: ## Check if server is running
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "$(GREEN)Server is running (PID: $$(cat $(PID_FILE)))$(NC)"; \
	else \
		rm -f $(PID_FILE); \
		echo "$(YELLOW)Server is not running$(NC)"; \
	fi

#------------------------------------------------------------------------------
# Build
#------------------------------------------------------------------------------

build: ## Build for production
	@echo "$(CYAN)Building for production...$(NC)"
	@bun run build
	@echo "$(GREEN)Build completed successfully$(NC)"

rebuild: clean build ## Clean and rebuild

#------------------------------------------------------------------------------
# Quality
#------------------------------------------------------------------------------

lint: ## Run ESLint
	@echo "$(CYAN)Running linter...$(NC)"
	@bun run lint

type-check: ## Run TypeScript type checking
	@echo "$(CYAN)Running type check...$(NC)"
	@bunx tsc --noEmit

check: lint type-check ## Run all quality checks

#------------------------------------------------------------------------------
# Cleanup
#------------------------------------------------------------------------------

clean: ## Remove build artifacts
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	@rm -rf .next
	@rm -rf out
	@rm -f $(PID_FILE)
	@echo "$(GREEN)Clean completed$(NC)"

clean-all: clean ## Remove all generated files including node_modules
	@echo "$(CYAN)Removing node_modules...$(NC)"
	@rm -rf node_modules
	@echo "$(GREEN)Full clean completed$(NC)"

fresh: clean-all install build ## Fresh install and build

#------------------------------------------------------------------------------
# Utilities
#------------------------------------------------------------------------------

update: ## Update dependencies
	@echo "$(CYAN)Updating dependencies...$(NC)"
	@bun update
	@echo "$(GREEN)Dependencies updated$(NC)"

outdated: ## Check for outdated dependencies
	@echo "$(CYAN)Checking for outdated dependencies...$(NC)"
	@bun outdated || true

analyze: build ## Analyze bundle size
	@echo "$(CYAN)Analyzing bundle...$(NC)"
	@ANALYZE=true bun run build || echo "$(YELLOW)Note: Install @next/bundle-analyzer for detailed analysis$(NC)"
