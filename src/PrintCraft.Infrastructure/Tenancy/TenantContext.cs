using PrintCraft.Application.Abstractions.Tenancy;

namespace PrintCraft.Infrastructure.Tenancy;

public class TenantContext : ICurrentTenant
{
    public Guid TenantId { get; private set; }
    public string TenantKey { get; private set; } = string.Empty;
    public bool IsResolved => TenantId != Guid.Empty;

    public void Resolve(Guid tenantId, string tenantKey)
    {
        try
        {
            TenantId = tenantId;
            TenantKey = tenantKey;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to resolve tenant context.", ex);
        }
    }
}
