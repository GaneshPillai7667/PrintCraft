using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class OrderItem : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
