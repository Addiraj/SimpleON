# SimpleOn Backend Service

Express.js REST API service for SimpleOn 3x10 Matrix & Booster Plan platform, powered by TypeScript, Prisma ORM, EIP-712 ECDSA signature verification, and Hardhat smart contracts.

## 1. Project Description

The SimpleOn backend manages user profiles, wallet-based authentication via EIP-712 SIWE nonces, booster plan join/upgrade transactions, 3x10 peer-to-peer matrix placements, daily capping limits, user referral relations, and audit logs.

## 2. Requirements

- Node.js >= 18
- MySQL >= 8.0 (or MariaDB)
- npm or yarn

## 3. Installation

```bash
cd backend
npm install
```

## 4. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL and secret keys in `.env`:
```env
DATABASE_URL="mysql://MYSQL_USER:MYSQL_PASSWORD@MYSQL_HOST:3306/simpleon"
```

## 5. Prisma Database Migrations Guide

### Migration Folder Location
All database migrations are stored inside `backend/prisma/migrations/`.
The schema is defined at `backend/prisma/schema.prisma` and seeded via `backend/prisma/seed.ts`.

### Dependency-Safe Migration Structure:
1. `202607240001_init_users_and_levels`
2. `202607240002_add_auth_tables`
3. `202607240003_add_referral_tables`
4. `202607240004_add_matrix_tables`
5. `202607240005_add_payment_tables`
6. `202607240006_add_transactions_and_ledger`
7. `202607240007_add_capping_tables`
8. `202607240008_add_upgrade_history`
9. `202607240009_add_notifications_and_preferences`
10. `202607240010_add_audit_and_idempotency`
11. `202607240011_add_system_configuration`
- `migration_lock.toml`

### Common Commands

#### 1. Validate Prisma Schema
```bash
npx prisma validate
```

#### 2. Generate Prisma Client
```bash
npx prisma generate
```

#### 3. Check Migration Status
```bash
npx prisma migrate status
```

#### 4. Create a New Development Migration
To create a new migration for local development after changing `schema.prisma`:
```bash
npx prisma migrate dev --name descriptive_migration_name
```

#### 5. Apply Committed Migrations in Production
To apply pending migrations to a live production database safely without generating new migration files:
```bash
npx prisma migrate deploy
```

#### 6. Run Seed Script
```bash
npx prisma db seed
```

#### 7. Open Prisma Studio
```bash
npx prisma studio
```

### Important Migration Principles & Safety Rules

1. **Do Not Modify Applied Migrations**: Old, already-applied migrations in production must never be edited directly. Editing applied migrations causes Prisma migration checksum mismatch errors. For schema modifications, create a new migration file.
2. **Backing up MySQL Before Production Migrations**: Always create a full database snapshot before executing `npx prisma migrate deploy` in production:
   ```bash
   mysqldump -u MYSQL_USER -p simpleon > backup_$(date +%Y%m%d_%H%M%S).sql
   ```
3. **Handling Failed Migrations**: If a migration fails during production execution:
   - Identify the cause using `npx prisma migrate status`.
   - Manually fix or roll back the failed SQL statements in MySQL.
   - Mark the migration as rolled back or resolved using:
     ```bash
     npx prisma migrate resolve --rolled-back "2026072400xx_migration_name"
     # or if applied manually:
     npx prisma migrate resolve --applied "2026072400xx_migration_name"
     ```
4. **Data Preservation**: For non-nullable columns on existing tables with live data, create the column as nullable first, backfill existing records, and then enforce the non-null constraint in a subsequent step.

## 6. Development Command

Start Express server in watch mode:
```bash
npm run dev
```

## 7. Build Command

Compile TypeScript server into standalone CommonJS bundle:
```bash
npm run build
```

## 8. Production Start Command

```bash
npm run start
```

## 9. Testing Commands

Run Vitest backend unit test suite:
```bash
npm run test
```

Watch tests:
```bash
npm run test:watch
```

Test coverage:
```bash
npm run test:coverage
```

## 10. Smart Contract & Hardhat Commands

Compile Solidity contracts:
```bash
npm run hardhat:compile
```

Run Hardhat tests:
```bash
npm run hardhat:test
```

Start local Hardhat blockchain node:
```bash
npm run hardhat:node
```

## 11. API Base URL

By default, the backend runs on:
`http://localhost:5000/api`

## 12. Folder Structure

```
backend/
├── server/               # Express MVC controllers, services, repositories, middlewares
│   ├── config/           # Environment and Logger configuration
│   ├── controllers/      # Route controllers (Auth, Booster, Matrix, User, etc.)
│   ├── middlewares/      # Express middlewares (Auth, RateLimiter, ErrorHandler)
│   ├── repositories/     # Data access repositories with Prisma & in-memory fallbacks
│   ├── routes/           # Express router declarations
│   ├── services/         # Core business logic engines
│   ├── utils/            # Helper functions (EIP-712 verify, JWT, etc.)
│   └── app.ts            # Express application setup
├── prisma/               # Database schema, migrations, and seed script
│   ├── schema.prisma
│   ├── migrations/       # MySQL 11-step migration sequence
│   └── seed.ts
├── contracts/            # Solidity smart contracts (SimpleOnBooster, MockUSDT)
├── tests/                # Unit test specifications
├── hardhat.config.js     # Hardhat EVM compiler configuration
├── server.ts             # Server entrypoint
├── package.json
└── README.md
```

## 13. Deployment Notes

For containerized deployment, build the Docker image using the provided `Dockerfile`:
```bash
docker build -t simpleon-backend .
docker run -p 5000:5000 --env-file .env simpleon-backend
```
