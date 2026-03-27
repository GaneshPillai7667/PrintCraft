using PrintCraft.Application.DTOs.Orders;

namespace PrintCraft.Application.Services;

public interface IOrderService
{
    Task<ServiceResponse<object>> CreateOrderAsync(Guid customerId, CreateOrderRequest request, CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> CreateGuestOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default);
}
