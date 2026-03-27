namespace PrintCraft.Application.Abstractions.Tenancy;

public interface ICurrentTenant
{
    Guid TenantId { get; }
    string TenantKey { get; }
    bool IsResolved { get; }
}
