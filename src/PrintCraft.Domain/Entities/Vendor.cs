using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class Vendor : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public decimal CommissionRate { get; set; }
}
