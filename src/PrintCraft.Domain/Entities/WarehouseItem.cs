using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class WarehouseItem : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal QuantityInStock { get; set; }
    public decimal ReorderThreshold { get; set; }
    public string Unit { get; set; } = "pcs";
}
