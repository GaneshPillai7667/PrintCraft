# Deployment Guide

## 1. Infrastructure

- Provision Supabase PostgreSQL project (or private managed PostgreSQL)
- Provision Redis (Azure Cache / ElastiCache)
- Provision blob storage (Azure Blob / S3) and map through abstraction layer
- Provision container runtime (AKS/EKS/App Service/ECS)

## 2. Configuration

Set environment variables (never commit secrets):

- `ConnectionStrings__DefaultConnection`
- `ConnectionStrings__Redis`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SecretKey`
- `Cors__AllowedOrigins__0`

## 3. Build and Push Images

```bash
docker build -f src/PrintCraft.API/Dockerfile -t your-registry/futureprint-api:latest .
docker build -f PrintCraftClientPortal/Dockerfile -t your-registry/futureprint-PrintCraftClientPortal:latest .
```

## 4. Database Migration Step

Run migrations during deployment startup or CI/CD release stage:

```bash
dotnet ef database update \
  --project src/PrintCraft.Infrastructure/PrintCraft.Infrastructure.csproj \
  --startup-project src/PrintCraft.API/PrintCraft.API.csproj
```

## 5. CI/CD Recommendation

- Build/test backend and PrintCraftClientPortal in separate jobs
- Run SAST + dependency vulnerability scan
- Push signed container images
- Deploy to staging
- Smoke-test (`/swagger`, auth, queue endpoint)
- Promote to production

## 6. Production Runtime Notes

- Enforce TLS 1.2+
- Put API behind WAF / API gateway
- Restrict Hangfire dashboard via network + auth policy
- Use short-lived access tokens and rotate refresh tokens
- Enable centralized logging and alerting
