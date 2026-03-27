using PrintCraft.Domain.Entities;
using PrintCraft.Infrastructure.Persistence;
using PrintCraft.Infrastructure.Tenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace PrintCraft.Infrastructure.Middleware;

public class TenantResolutionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext, ApplicationDbContext dbContext)
    {
        try
        {
            var tenantHeader = context.Request.Headers["X-Tenant-Id"].FirstOrDefault();
            var host = context.Request.Host.Host;
            var subdomain = host.Contains('.') ? host.Split('.')[0] : string.Empty;

            Tenant? tenant = null;

            if (Guid.TryParse(tenantHeader, out var tenantId))
            {
                tenant = await dbContext.Tenants.FirstOrDefaultAsync(x => x.Id == tenantId && x.IsActive);
            }

            if (tenant is null && !string.IsNullOrWhiteSpace(subdomain))
            {
                tenant = await dbContext.Tenants.FirstOrDefaultAsync(x => x.Subdomain == subdomain && x.IsActive);
            }

            if (tenant is not null)
            {
                tenantContext.Resolve(tenant.Id, tenant.Slug);
                context.Items["TenantId"] = tenant.Id;
            }

            await next(context);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed while resolving tenant context from request.", ex);
        }
    }
}
