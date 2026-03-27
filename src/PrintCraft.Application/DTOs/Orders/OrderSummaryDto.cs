namespace PrintCraft.Application.DTOs.Orders;

public record OrderSummaryDto(
    Guid Id,
    decimal TotalAmount,
    string Status,
    DateTime DueDateUtc,
    bool IsExpress,
    string Priority);
