using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class AuditLog : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string DataJson { get; set; } = "{}";
    public string IpAddress { get; set; } = string.Empty;
}
