using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.Orders;
using PrintCraft.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace PrintCraft.Application.Services;

public class OrderService(
    IRepository<Order> orderRepository,
    IRepository<Product> productRepository,
    IRepository<PrintQueueItem> queueRepository,
    IUnitOfWork unitOfWork,
    ILogger<OrderService> logger) : IOrderService
{
    public async Task<ServiceResponse<object>> CreateOrderAsync(Guid customerId, CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await productRepository.Query()
                .Where(x => productIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, cancellationToken);

            var missingProductIds = productIds.Where(id => !products.ContainsKey(id)).ToList();
            if (missingProductIds.Count > 0)
            {
                return ServiceResponse<object>.Fail($"Unknown product ids: {string.Join(", ", missingProductIds)}", 400);
            }

            var order = new Order
            {
                CustomerId = customerId,
                DueDateUtc = request.DueDateUtc,
                IsExpress = request.IsExpress,
                Priority = request.Priority,
                DesignConfigurationJson = request.DesignConfigurationJson,
                TotalAmount = request.Items.Sum(item => products[item.ProductId].BasePrice * item.Quantity)
            };

            order.Items = request.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = products[item.ProductId].BasePrice,
                OrderId = order.Id
            }).ToList();

            await orderRepository.AddAsync(order, cancellationToken);

            var queueItem = new PrintQueueItem
            {
                OrderId = order.Id,
                QueuePosition = 9999,
                Priority = order.Priority,
                DueDateUtc = order.DueDateUtc
            };

            await queueRepository.AddAsync(queueItem, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            var response = new OrderSummaryDto(
                order.Id,
                order.TotalAmount,
                order.Status,
                order.DueDateUtc,
                order.IsExpress,
                order.Priority.ToString());

            return ServiceResponse<object>.Created(response, "Order created successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to create order for customer {CustomerId}", customerId);
            return ServiceResponse<object>.Fail("Unable to create order at the moment.", 500);
        }
    }

    public async Task<ServiceResponse<object>> CreateGuestOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var guestId = Guid.NewGuid();
            var orderResult = await CreateOrderAsync(guestId, request, cancellationToken);
            if (!orderResult.Success)
            {
                return orderResult;
            }

            var order = (OrderSummaryDto)orderResult.Data!;
            return ServiceResponse<object>.Created(new { order.Id, order.TotalAmount, order.Status }, "Guest order created successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to create guest order.");
            return ServiceResponse<object>.Fail("Unable to create guest order at the moment.", 500);
        }
    }
}
