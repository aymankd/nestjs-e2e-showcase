# NestJS E2E Showcase

A NestJS application with DrizzleORM, PostgreSQL, and comprehensive testing setup.

## Quick Start

### Prerequisites
- Node.js (use version specified in `.nvmrc`)
- pnpm
- Docker & Docker Compose

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```

3. **Start database**
   ```bash
   pnpm run docker-compose:up
   ```

4. **Setup database schema**
   ```bash
   pnpm run db:push
   ```

5. **Start the application**
   ```bash
   pnpm run start:dev
   ```

The app will be running at `http://localhost:3000`

## Available Scripts

```bash
# Development
pnpm run start:dev     # Start with hot reload
pnpm run start         # Start production build

# Database
pnpm run db:push       # Push schema to database
pnpm run db:generate   # Generate migrations
pnpm run db:studio     # Open database GUI

# Testing
pnpm run test          # Unit tests
pnpm run test:e2e      # End-to-end tests

# Docker
pnpm run docker-compose:up    # Start PostgreSQL
pnpm run docker-compose:down  # Stop PostgreSQL
```

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL + DrizzleORM
- **Validation**: Environment validation with Joi
- **Testing**: Jest + Supertest
