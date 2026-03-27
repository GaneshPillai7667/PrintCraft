namespace PrintCraft.Domain.Common;

public interface IMultiTenant
{
    Guid TenantId { get; set; }
}
