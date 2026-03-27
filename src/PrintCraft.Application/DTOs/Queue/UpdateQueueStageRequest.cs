using PrintCraft.Domain.Enums;

namespace PrintCraft.Application.DTOs.Queue;

public record UpdateQueueStageRequest(Guid QueueItemId, ProductionStage Stage);
