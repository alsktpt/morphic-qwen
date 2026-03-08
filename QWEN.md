# Morphic - QWEN.md

## Project Overview

**Morphic** is an AI-powered search engine with a generative UI built on Next.js 16. It provides natural language question understanding with multiple search provider support (Tavily, Brave, SearXNG, Exa) and delivers AI-generated responses with dynamic UI components.

### Core Technologies

- **Framework**: Next.js 16 with App Router, React Server Components, and Turbopack
- **Language**: TypeScript 5 (strict mode)
- **Runtime**: Bun 1.2.12
- **AI Integration**: Vercel AI SDK 6.x for streaming and GenerativeUI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth (optional)
- **UI**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Testing**: Vitest with jsdom
- **Search Providers**: Tavily (default), SearXNG, Exa, Brave, Firecrawl

### Architecture

```
morphic/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (chat, search, auth)
│   ├── auth/              # Authentication pages
│   └── search/            # Search functionality
├── components/            # React components
│   ├── artifact/          # Search result display
│   ├── sidebar/           # Navigation & history
│   └── ui/                # shadcn/ui primitives
├── lib/                   # Core logic
│   ├── agents/            # AI agents
│   ├── auth/              # Authentication logic
│   ├── db/                # Database schema & migrations
│   ├── streaming/         # AI response streaming
│   ├── tools/             # Search & retrieval tools
│   └── types/             # TypeScript types
├── config/models/         # AI model configurations
├── drizzle/               # Database migrations
└── docs/                  # Documentation
```

## Building and Running

### Prerequisites

- **Bun**: 1.2.12 (`bun --version`)
- **Node.js**: 20+ (fallback)
- **PostgreSQL**: For chat history (optional for stateless mode)

### Installation

```bash
bun install
```

### Development

```bash
# Start development server with Turbopack (http://localhost:3000)
bun dev
```

### Production

```bash
# Build for production
bun run build

# Start production server
bun start
```

### Testing

```bash
# Run all tests (Vitest)
bun run test

# Run tests in watch mode
bun run test:watch
```

**Note**: Use `bun run test`, NOT `bun test` (lacks Vitest features)

### Code Quality

```bash
# Lint (includes import sorting)
bun lint

# Fix linting issues
bun lint --fix

# Type check
bun typecheck

# Format code
bun format

# Check formatting (no changes)
bun format:check
```

### Database

```bash
# Run migrations
bun migrate
```

### Docker

```bash
# Start all services (PostgreSQL, Redis, SearXNG, Morphic)
docker compose up -d

# Stop all containers
docker compose down

# Stop and remove volumes (deletes data)
docker compose down -v
```

## Environment Configuration

### Required Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Database (required for chat history)
DATABASE_URL=postgresql://user:password@localhost:5432/morphic

# AI Provider (at least one required)
OPENAI_API_KEY=sk-...           # Default provider
# OR
ANTHROPIC_API_KEY=...           # Claude
# OR
GOOGLE_GENERATIVE_AI_API_KEY=... # Gemini
# OR
ALIBABA_API_KEY=...             # Qwen (configured in default.json)

# Search Provider (at least one required)
TAVILY_API_KEY=...              # Default
# OR
EXA_API_KEY=...
# OR
FIRECRAWL_API_KEY=...
```

### Optional Features

```bash
# Authentication (default: disabled/anonymous mode)
ENABLE_AUTH=false

# Guest mode (try without account)
ENABLE_GUEST_CHAT=true

# Alternative search (SearXNG)
SEARCH_API=searxng
SEARXNG_API_URL=http://localhost:8080

# File uploads (Cloudflare R2)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

# Monitoring
ENABLE_LANGFUSE_TRACING=true
LANGFUSE_SECRET_KEY=...
LANGFUSE_PUBLIC_KEY=...
```

## Development Conventions

### TypeScript

- **Strict mode** enabled
- **Path aliases**: `@/*` maps to project root
- **Target**: ES2017
- No emit (type-check only)

### Code Style

- **Semicolons**: None
- **Quotes**: Single
- **Tabs**: 2 spaces
- **Trailing commas**: None
- **Arrow parens**: Avoid when single param

### Import Order (ESLint)

1. React, Next.js
2. Third-party packages
3. Internal: `@/types`, `@/config`, `@/lib`, `@/hooks`
4. Components: `@/components/ui`, `@/components`
5. Relative imports
6. CSS/SCSS

### Commit Convention

Uses conventional commits:

```bash
feat: add new feature
fix: resolve issue with X
docs: update README
chore: update dependencies
refactor: improve code structure
```

### Testing Practices

- **Framework**: Vitest with React Testing Library
- **Location**: Tests alongside source files (`*.test.ts`/`*.test.tsx`)
- **Environment**: jsdom for component tests
- **Coverage**: Required before PRs

## Key Features

### Search Modes

- **Quick**: Fast responses with speed-optimized models
- **Planning**: Structured research with todo tracking
- **Adaptive**: Automatically selects speed vs quality

### Model Configuration

Models are configured in `config/models/*.json`:

```json
{
  "models": {
    "byMode": {
      "quick": {
        "speed": { "id": "qwen-flash", "providerId": "alibaba" },
        "quality": { "id": "qwen-plus", "providerId": "alibaba" }
      }
    }
  }
}
```

### Authentication

- **Default**: Anonymous mode (all users share one ID)
- **Optional**: Supabase Auth for user isolation
- **Guest Mode**: Ephemeral sessions without accounts

### Database Schema

Key tables (Drizzle ORM):

- `chats`: Conversation storage
- `messages`: Individual messages
- `parts`: Message content parts
- `votes`: User feedback

## Pre-PR Checklist

Before submitting a pull request:

1. ✅ `bun lint` - No ESLint errors
2. ✅ `bun typecheck` - No TypeScript errors
3. ✅ `bun format:check` - Proper formatting
4. ✅ `bun run build` - Successful build
5. ✅ `bun run test` - All tests pass

## Useful Commands

```bash
# CLI chat interface
bun chat

# Redis connection (local)
redis-cli

# PostgreSQL (Docker)
docker compose exec postgres psql -U morphic -d morphic
```

## Common Issues

### Database Connection

- Local: Use `postgresql://user:pass@localhost:5432/dbname`
- Docker: Use service name `postgresql://user:pass@postgres:5432/dbname`
- Cloud: Add `?sslmode=require` for Neon/Supabase

### SSL Disabled

For local PostgreSQL in Docker:
```bash
DATABASE_SSL_DISABLED=true
```

### Model Configuration

When switching AI providers, update `config/models/*.json` with compatible model IDs for your provider.

## Documentation

- [Configuration Guide](docs/CONFIGURATION.md) - Detailed feature configuration
- [Docker Guide](docs/DOCKER.md) - Container deployment
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [DeepWiki](https://deepwiki.com/miurla/morphic) - AI-generated docs
