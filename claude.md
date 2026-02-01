# Claude Instructions

## Project Overview

bytemines.io is a personal website and blog built with Next.js 16, React 19, and Tailwind CSS 4. Uses Bun as package manager.

## Commands

Always use `make` commands for development:

- `make dev` - Start development server (port 4321)
- `make build` - Build for production
- `make lint` - Run linter
- `make type-check` - TypeScript checking
- `make clean` - Clean build artifacts

## Project Structure

```
app/                  # Next.js app router pages
components/           # React components
content/              # MDX blog posts and content
lib/                  # Utility functions
public/               # Static assets
```

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- ESLint for linting
- Functional components with hooks

## Commits

- Use conventional commit messages
- Do not include Co-Authored-By lines
- Keep commits atomic and focused

## Testing Changes

Before committing:
1. Run `make lint` to check for linting errors
2. Run `make build` to ensure production build works
