# Node.js TypeScript Backend Boilerplate

A modern, production-ready TypeScript Node.js backend boilerplate with PostgreSQL, Drizzle ORM, Express, and Docker support.

## 🚀 Features

- **TypeScript** - Type-safe development with path mapping
- **Express.js** - Fast, minimalist web framework
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries
- **Docker Compose** - Containerized PostgreSQL
- **Pino Logging** - High-performance logging with beautiful development formatting
- **Path Aliases** - Clean imports with `@folder/` syntax
- **CORS** - Cross-Origin Resource Sharing enabled
- **Environment Variables** - Secure configuration management
- **Standard Folder Structure** - Organized codebase
- **Hot Reload** - Development with nodemon

## 📁 Project Structure

```
node-ts-boilerplate/
├── src/
│   ├── controllers/         # Request handlers
│   │   └── userController.ts
│   ├── routes/             # Route definitions
│   │   ├── index.ts        # Route aggregator
│   │   └── userRoutes.ts
│   ├── db/                 # Database related files
│   │   ├── connection.ts   # Database connection
│   │   ├── schema.ts       # Database schema
│   │   └── migrations/     # Auto-generated migrations
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── middleware/         # Custom middleware
│   │   └── errorHandler.ts # Error handling middleware
│   ├── utils/              # Utility functions
│   │   └── logger.ts       # Pino logger configuration
│   └── app.ts              # Express app configuration & server entry point
├── docker-compose.yml      # PostgreSQL container
├── drizzle.config.ts       # Drizzle ORM configuration
├── tsconfig.json           # TypeScript configuration with path mapping
├── .env                    # Environment variables
├── .env.example            # Environment variables template
└── package.json            # Dependencies and scripts
```

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker & Docker Compose

## ⚡ Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd node-ts-boilerplate
pnpm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Update `.env` with your configuration if needed (defaults should work for development).

### 3. Start PostgreSQL Database

```bash
pnpm run docker:up
```

This will start a PostgreSQL container with the following default credentials:
- **Host:** localhost
- **Port:** 5432
- **Database:** myapp
- **Username:** postgres
- **Password:** postgres

### 4. Generate and Run Database Migrations

```bash
# Generate migration files
pnpm run db:generate

# Apply migrations to database
pnpm run db:migrate
```

### 5. Start Development Server

```bash
pnpm run dev
```

The server will start on `http://localhost:3000` with beautiful colored logs in development mode. 

**Pro Tip:** The project uses TypeScript path aliases - you can import files using `@folder/` syntax instead of relative paths!

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server with hot reload |
| `pnpm run build` | Build the project for production |
| `pnpm run start` | Start the production server |
| `pnpm run docker:up` | Start PostgreSQL container |
| `pnpm run docker:down` | Stop PostgreSQL container |
| `pnpm run docker:logs` | View container logs |
| `pnpm run db:generate` | Generate database migration files |
| `pnpm run db:migrate` | Apply migrations to database |
| `pnpm run db:push` | Push schema changes directly to database |
| `pnpm run db:studio` | Open Drizzle Studio (database GUI) |

## 🗄️ Database Management

### Drizzle Studio
Access the database GUI:
```bash
pnpm run db:studio
```

### Adding New Tables
1. Define your schema in `src/db/schema.ts`
2. Generate migration: `pnpm run db:generate`
3. Apply migration: `pnpm run db:migrate`

### Example Schema Addition
```typescript
// src/db/schema.ts
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## 🔗 API Endpoints

The boilerplate includes a complete users CRUD API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Example API Usage

```bash
# Health check
curl http://localhost:3000/health

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get all users
curl http://localhost:3000/api/users
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/myapp` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level (trace, debug, info, warn, error) | `info` |

### Database Configuration

The PostgreSQL container is configured with:
- **Image:** postgres:15-alpine
- **Container name:** node-ts-postgres
- **Persistent volume:** postgres_data
- **Network:** app-network

### Logging Configuration

The project uses **Pino** for high-performance logging:

**Development Mode:**
- Beautiful colored output with `pino-pretty`
- Human-readable timestamps
- Request/response logging
- Error stack traces

**Production Mode:**
- Structured JSON logs
- ISO timestamps
- Optimized for log aggregation systems

**Usage in code:**
```typescript
import logger from '../utils/logger';

logger.info('Server started');
logger.error({ error, userId }, 'Failed to create user');
```

### Path Aliases Configuration

The project uses TypeScript path mapping for clean imports:

**Available Aliases:**
- `@/` - src root directory
- `@controllers/` - controllers folder
- `@middleware/` - middleware folder  
- `@routes/` - routes folder
- `@utils/` - utils folder
- `@custom-types/` - types folder
- `@db/` - database folder

**Usage Examples:**
```typescript
// Instead of relative paths
import { userController } from '../controllers/userController';
import logger from '../utils/logger';
import { db } from '../db/connection';

// Use clean aliases
import { userController } from '@controllers/userController';
import logger from '@utils/logger';
import { db } from '@db/connection';
```

**Benefits:**
- No more `../../../` relative path mess
- Easier refactoring when moving files
- Cleaner and more readable imports
- Consistent import paths across the project

**Adding New Path Aliases:**
To add new path aliases, update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@your-folder/*": ["your-folder/*"]
    }
  }
}
```

## 🏗️ Adding New Features

### 1. Create a New Route
```typescript
// src/routes/productRoutes.ts
import { Router } from 'express';
import { productController } from '@controllers/productController';

export const productRoutes = Router();
productRoutes.get('/', productController.getAllProducts);
```

### 2. Create a Controller
```typescript
// src/controllers/productController.ts
import { Request, Response } from 'express';
import type { ApiResponse } from '@custom-types';
import logger from '@utils/logger';

export const productController = {
  getAllProducts: async (req: Request, res: Response<ApiResponse>) => {
    logger.info('Fetching all products');
    // Implementation
  }
};
```

### 3. Register Routes
```typescript
// src/app.ts (or src/routes/index.ts)
import { productRoutes } from '@routes/productRoutes';

app.use('/api/products', productRoutes);
```

## 🚀 Production Deployment

### 1. Build the Project
```bash
pnpm run build
```

### 2. Set Production Environment Variables
```bash
export NODE_ENV=production
export DATABASE_URL=your_production_database_url
export PORT=3000
```

### 3. Start the Server
```bash
pnpm run start
```

## 🔍 Debugging

### View Application Logs
In development, logs are automatically formatted with colors and readable timestamps. For production logs:

```bash
# View structured JSON logs
pnpm run start

# Adjust log level
LOG_LEVEL=debug pnpm run dev
```

### View Database Logs
```bash
pnpm run docker:logs
```

### Connect to PostgreSQL Container
```bash
docker exec -it node-ts-postgres psql -U postgres -d myapp
```

### Common Issues

1. **Port 5432 already in use**: Stop local PostgreSQL or change the port in `docker-compose.yml`
2. **Port 3000 already in use**: Change the PORT in `.env` file
3. **Permission denied**: Ensure Docker daemon is running
4. **Database connection failed**: Check if the PostgreSQL container is running
5. **Import errors**: Run `pnpm run build` to check TypeScript compilation
6. **Path alias not working**: Ensure `baseUrl` and `paths` are correctly configured in `tsconfig.json`

## 📚 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript with path mapping
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Logging:** Pino with pino-pretty
- **Container:** Docker & Docker Compose
- **Package Manager:** pnpm
- **Developer Experience:** Path aliases, hot reload, type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Happy coding! 🎉** 