using PrintCraft.Domain.Enums;

namespace PrintCraft.Application.DTOs.Orders;

public record OrderItemRequest(Guid ProductId, int Quantity);

public record CreateOrderRequest(
    List<OrderItemRequest> Items,
    DateTime DueDateUtc,
    bool IsExpress,
    OrderPriorityType Priority,
    string DesignConfigurationJson);
