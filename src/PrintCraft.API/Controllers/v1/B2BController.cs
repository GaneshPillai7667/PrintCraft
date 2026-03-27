using PrintCraft.Application.DTOs.B2B;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize(Roles = "B2BCustomer,TenantAdmin,SuperAdmin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/b2b")]
public class B2BController(
    IB2BAppService b2BService,
    ILogger<B2BController> logger) : ControllerBase
{
    [HttpGet("bulk-orders")]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var result = await b2BService.GetBulkOrdersAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Get bulk orders.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading bulk orders.", 500));
        }
    }

    [HttpPost("bulk-orders")]
    public async Task<IActionResult> Create(CreateB2BBulkOrderRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await b2BService.CreateBulkOrderAsync(request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Create bulk order.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while creating bulk order.", 500));
        }
    }
}
