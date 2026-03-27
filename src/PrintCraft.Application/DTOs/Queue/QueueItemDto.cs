namespace PrintCraft.Application.DTOs.Queue;

public record QueueItemDto(
    Guid Id,
    Guid OrderId,
    int QueuePosition,
    string Priority,
    DateTime DueDateUtc,
    string Stage,
    Guid? AssignedToUserId);
