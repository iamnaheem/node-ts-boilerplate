# Node.js TypeScript Enterprise Boilerplate 🚀

A **production-ready** Node.js + TypeScript backend boilerplate with enterprise-grade features including JWT authentication, code quality tools, and comprehensive security. Built for scalability and developer productivity.

### **✨ Enterprise Features**
- 🔐 **Complete JWT Authentication** - Access/refresh tokens with bcrypt hashing
- 🛡️ **Type-Safe Validation** - Zod schemas with detailed error messages  
- 🎯 **Code Quality Enforcement** - ESLint + Prettier + Husky pre-commit hooks
- 📊 **Production Logging** - Structured JSON logs with Pino
- 🗄️ **Modern Database Stack** - PostgreSQL + Drizzle ORM with migrations
- 🚀 **Developer Experience** - Path aliases, Node.js native watch mode, strict TypeScript

Perfect starting point for building **scalable REST APIs** with authentication, validation, and enterprise-grade code quality.

## 🚀 Features

### **Core Framework**
- **TypeScript** - Type-safe development with path mapping
- **Express.js** - Fast, minimalist web framework
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries with migrations
- **Docker Compose** - Containerized PostgreSQL

### **Authentication & Security**
- **JWT Authentication** - Complete auth system with access & refresh tokens
- **Password Hashing** - bcrypt with salt rounds for secure storage
- **Role-Based Access Control** - Admin/user roles with middleware protection
- **Input Validation** - Zod schemas with detailed error messages
- **Request Validation** - Body, params, and query parameter validation

### **Developer Experience**
- **Path Aliases** - Clean imports with `@folder/` syntax
- **Pino Logging** - High-performance logging with beautiful development formatting
- **Code Quality** - ESLint + Prettier with pre-commit hooks
- **Hot Reload** - Development with Node.js's built-in `--watch` flag
- **Type Safety** - End-to-end TypeScript with strict configuration

### **Production Ready**
- **Environment Variables** - Secure configuration management with Node.js's built-in `--env-file` flag
- **Error Handling** - Comprehensive error handling with structured logging
- **API Standards** - Consistent response format with detailed error messages
- **CORS** - Cross-Origin Resource Sharing enabled
- **Standard Folder Structure** - Organized codebase with clear separation

## 📁 Project Structure

```
node-ts-boilerplate/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts # Authentication endpoints
│   │   └── userController.ts # User CRUD operations
│   ├── routes/             # Route definitions
│   │   ├── index.ts        # Route aggregator
│   │   ├── authRoutes.ts   # Authentication routes
│   │   └── userRoutes.ts   # User routes
│   ├── schemas/            # Zod validation schemas
│   │   ├── authSchemas.ts  # Auth validation schemas
│   │   └── userSchemas.ts  # User validation schemas
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts         # JWT authentication middleware
│   │   ├── errorHandler.ts # Error handling middleware
│   │   └── validation.ts   # Request validation middleware
│   ├── db/                 # Database related files
│   │   ├── connection.ts   # Database connection
│   │   ├── schema.ts       # Database schema (users, refresh_tokens)
│   │   └── migrations/     # Auto-generated migrations
│   ├── utils/              # Utility functions
│   │   ├── jwt.ts          # JWT token utilities
│   │   └── logger.ts       # Pino logger configuration
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Common types and interfaces
│   └── app.ts              # Express app configuration & server entry point
├── docker-compose.yml      # PostgreSQL container
├── drizzle.config.ts       # Drizzle ORM configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .lintstagedrc.json      # Lint-staged configuration
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

The server will start on `http://localhost:3000` with beautiful colored logs in development mode. The development server uses Node.js's built-in `--watch` flag for automatic reloading and `--env-file` for environment variable loading.

**Pro Tip:** The project uses TypeScript path aliases - you can import files using `@folder/` syntax instead of relative paths!

## 📝 Available Scripts

### **Development**
| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server with Node.js's built-in watch mode |
| `pnpm run build` | Build the project for production |
| `pnpm run start` | Start the production server |

### **Code Quality**
| Script | Description |
|--------|-------------|
| `pnpm run lint` | Run ESLint and fix issues |
| `pnpm run lint:check` | Check for linting issues without fixing |
| `pnpm run format` | Format code with Prettier |
| `pnpm run format:check` | Check code formatting without fixing |

### **Database**
| Script | Description |
|--------|-------------|
| `pnpm run db:generate` | Generate database migration files |
| `pnpm run db:migrate` | Apply migrations to database |
| `pnpm run db:push` | Push schema changes directly to database |
| `pnpm run db:studio` | Open Drizzle Studio (database GUI) |

### **Docker**
| Script | Description |
|--------|-------------|
| `pnpm run docker:up` | Start PostgreSQL container |
| `pnpm run docker:down` | Stop PostgreSQL container |
| `pnpm run docker:logs` | View container logs |

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

### **Authentication Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/profile` | Get current user profile | Yes |
| POST | `/api/v1/auth/logout` | Logout user | No |

### **User Management Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users (with pagination) | Optional |
| GET | `/api/v1/users/:id` | Get user by ID | Optional |
| POST | `/api/v1/users` | Create new user | Optional |
| PUT | `/api/v1/users/:id` | Update user | Optional |
| DELETE | `/api/v1/users/:id` | Delete user | Optional |

### **System Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |

### Example API Usage

#### **Authentication Flow**
```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get user profile (requires Bearer token)
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh access token
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

#### **User Management**
```bash
# Get all users with pagination
curl "http://localhost:3000/api/v1/users?page=1&limit=10"

# Get user by ID
curl http://localhost:3000/api/v1/users/1

# Create a user (admin only in protected setup)
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

#### **System Health**
```bash
# Health check
curl http://localhost:3000/health
```

## 🔧 Configuration

### Environment Variables

#### **Core Configuration**
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/myapp` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |

#### **Authentication**
| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for signing access tokens | `your-super-secret-jwt-key-change-this-in-production` |
| `JWT_EXPIRES_IN` | Access token expiration time | `15m` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `your-super-secret-refresh-key-change-this-in-production` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time | `7d` |

#### **Logging**
| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (trace, debug, info, warn, error) | `info` |

> **⚠️ Security Note:** Change all JWT secrets in production! Use strong, randomly generated keys.

### Modern Node.js Features

This project leverages Node.js's built-in capabilities for development:

- **`--watch` flag** - Automatic file watching and process restarting without external dependencies
- **`--env-file` flag** - Native environment variable loading from `.env` files  
- **`--loader` flag** - TypeScript support through ts-node/esm loader

These features eliminate the need for external packages like `nodemon` and `dotenv`, resulting in fewer dependencies and better performance.

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

### **Core Framework**
- **Runtime:** Node.js
- **Language:** TypeScript with strict configuration & path mapping
- **Framework:** Express.js
- **Package Manager:** pnpm (fast, disk-efficient)

### **Database & ORM**
- **Database:** PostgreSQL (containerized with Docker)
- **ORM:** Drizzle ORM (type-safe, zero-runtime overhead)
- **Migrations:** Drizzle Kit with auto-generation

### **Authentication & Security**
- **Authentication:** JWT (access + refresh tokens)
- **Password Hashing:** bcrypt with configurable salt rounds
- **Validation:** Zod schemas for type-safe validation
- **CORS:** Configurable cross-origin resource sharing

### **Code Quality & Development**
- **Linting:** ESLint with modern TypeScript rules
- **Formatting:** Prettier with opinionated defaults
- **Git Hooks:** Husky + lint-staged for pre-commit quality
- **Hot Reload:** Node.js's built-in `--watch` flag for development
- **Type Safety:** End-to-end TypeScript with strict mode

### **Logging & Monitoring**
- **Logging:** Pino (high-performance JSON logging)
- **Development:** pino-pretty for human-readable logs
- **Production:** Structured JSON logs for aggregation

### **DevOps & Tooling**
- **Containerization:** Docker & Docker Compose
- **Database GUI:** Drizzle Studio for schema management
- **Developer Experience:** Path aliases, clean imports, type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉** 