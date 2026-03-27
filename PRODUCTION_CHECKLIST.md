# Production Checklist

## Security

- [ ] JWT secret stored in secret manager (not files)
- [ ] HTTPS and HSTS enabled in all environments
- [ ] CORS restricted to exact frontend domains
- [ ] Rate limiting thresholds tuned per endpoint
- [ ] File upload MIME and size validation enforced
- [ ] Anti-CSRF strategy applied for cookie auth flows
- [ ] Sensitive columns encrypted at rest (TDE + app-level where required)

## Multi-Tenancy

- [ ] Tenant onboarding automation
- [ ] Tenant-specific branding/configuration validated
- [ ] Tenant-level audit logs retained and queryable
- [ ] Data isolation tests for every transactional endpoint

## Reliability

- [ ] Health checks and readiness probes enabled
- [ ] Background jobs idempotent and retriable
- [ ] Queue SLA alerts configured
- [ ] Backup/restore runbook tested

## Performance

- [ ] Redis caching strategy enabled for storefront/config endpoints
- [ ] CDN in front of static assets and product images
- [ ] 3D assets compressed and lazy loaded
- [ ] DB indexes validated for tenant + high-cardinality lookups

## Compliance and Payments

- [ ] Stripe tokenization only (no raw PAN storage)
- [ ] PII retention and deletion policies defined
- [ ] Terms, privacy, and tax compliance reviewed per region

## Operations

- [ ] Serilog sink to centralized log platform
- [ ] Dashboards for API latency, queue lag, order throughput
- [ ] Incident response and rollback procedures documented
