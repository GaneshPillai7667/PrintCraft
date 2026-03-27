using System.Security.Claims;
using PrintCraft.Application.DTOs.Orders;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/orders")]
public class OrdersController(
    IOrderService orderService,
    ILogger<OrdersController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("sub");
            if (!Guid.TryParse(sub, out var customerId))
            {
                return Unauthorized(ServiceResponse<object>.Fail("Invalid authentication context.", 401));
            }

            var result = await orderService.CreateOrderAsync(customerId, request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in CreateOrder.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while creating order.", 500));
        }
    }

    [AllowAnonymous]
    [HttpPost("guest")]
    public async Task<IActionResult> CreateGuestOrder(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await orderService.CreateGuestOrderAsync(request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in CreateGuestOrder.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while creating guest order.", 500));
        }
    }
}
