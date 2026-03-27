using PrintCraft.Domain.Common;
using PrintCraft.Domain.Enums;

namespace PrintCraft.Domain.Entities;

public class Order : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid CustomerId { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderPriorityType Priority { get; set; } = OrderPriorityType.Normal;
    public bool IsExpress { get; set; }
    public DateTime DueDateUtc { get; set; }
    public ProductionStage ProductionStage { get; set; } = ProductionStage.Queued;
    public string Status { get; set; } = "Pending";
    public string DesignConfigurationJson { get; set; } = "{}";
    public List<OrderItem> Items { get; set; } = [];
}
