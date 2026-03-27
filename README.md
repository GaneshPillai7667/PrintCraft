# PrintCraft Multi-Tenant 3D Custom Printing eCommerce SaaS

Production-oriented scaffold for a multi-tenant printing platform with:

- ASP.NET Core 8 Web API (Clean Architecture layers)
- EF Core + Supabase PostgreSQL + migrations
- JWT + refresh token rotation foundation
- Tenant isolation via `TenantId` and middleware (`X-Tenant-Id` or subdomain)
- Role-based authorization for Admin/Production/Warehouse/Vendor/B2B/Customer
- Queue + warehouse + vendor + CMS + storefront + B2B endpoints
- SignalR hub for real-time queue updates
- Hangfire + Redis-ready infrastructure
- Separate React portals:
- `PrintCraftClientPortal` client eCommerce website (catalog, 3D preview modal, cart)
- `PrintCraftAdminPortal` admin control panel (dashboard, products, orders, CMS)
- Docker + docker-compose for local orchestration

## Monorepo Structure

- `src/PrintCraft.Domain`: entities/enums/shared contracts
- `src/PrintCraft.Application`: service abstractions, DTOs, validators, app services
- `src/PrintCraft.Infrastructure`: EF Core, repositories, auth, middleware, tenancy
- `src/PrintCraft.API`: API host, controllers, SignalR, security pipeline
- `PrintCraftClientPortal`: client eCommerce web app
- `PrintCraftAdminPortal`: admin management app
- `database/schema.sql`: generated SQL script from EF migrations

## Security Features Included

- HTTPS redirection + HSTS
- JWT authentication
- Refresh token storage and rotation foundation
- Role-based authorization
- Strict CORS policy
- Built-in rate limiting
- Global exception middleware
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`)
- Password hashing with BCrypt
- Tenant-aware repository query filtering

## Run Locally (Docker)

```bash
docker compose up --build
```

- API: `http://localhost:8080`
- PrintCraftClientPortal (client): `http://localhost:5173`
- Hangfire: `http://localhost:8080/hangfire`

## Run Locally (without Docker)

```bash
# API
cd src/PrintCraft.API
dotnet run

# Client website
cd PrintCraftClientPortal
npm install
npm run dev

# Admin portal (separate terminal)
cd PrintCraftAdminPortal
npm install
npm run dev
```

## EF Migrations

Migrations are in:

- `src/PrintCraft.Infrastructure/Persistence/Migrations`

Apply migrations:

```bash
dotnet ef database update \
  --project src/PrintCraft.Infrastructure/PrintCraft.Infrastructure.csproj \
  --startup-project src/PrintCraft.API/PrintCraft.API.csproj
```

## Key API Endpoints (v1)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/orders`
- `GET /api/v1/queue`
- `POST /api/v1/queue/stage`
- `GET /api/v1/warehouse/items`
- `POST /api/v1/warehouse/items`
- `GET /api/v1/vendors`
- `POST /api/v1/vendors`
- `GET /api/v1/admin/cms/sections`
- `POST /api/v1/admin/cms/sections`
- `GET /api/v1/b2b/bulk-orders`
- `POST /api/v1/b2b/bulk-orders`
- `GET /api/v1/storefront/home`

## Current Status

This scaffold now uses separate client and admin portals with shared backend APIs. Advanced modules (full AR/WebXR pipeline, AI generation orchestration, full payment workflow, and complete franchise accounting) remain prepared as extension points.
