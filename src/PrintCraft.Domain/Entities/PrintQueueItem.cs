using PrintCraft.Domain.Common;
using PrintCraft.Domain.Enums;

namespace PrintCraft.Domain.Entities;

public class PrintQueueItem : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid OrderId { get; set; }
    public Guid? AssignedToUserId { get; set; }
    public int QueuePosition { get; set; }
    public OrderPriorityType Priority { get; set; }
    public DateTime DueDateUtc { get; set; }
    public ProductionStage Stage { get; set; } = ProductionStage.Queued;
}
