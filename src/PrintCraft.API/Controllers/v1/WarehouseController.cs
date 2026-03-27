using PrintCraft.Application.DTOs.Warehouse;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize(Roles = "WarehouseStaff,TenantAdmin,SuperAdmin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/warehouse")]
public class WarehouseController(
    IWarehouseAppService warehouseService,
    ILogger<WarehouseController> logger) : ControllerBase
{
    [HttpGet("items")]
    public async Task<IActionResult> GetItems(CancellationToken cancellationToken)
    {
        try
        {
            var result = await warehouseService.GetItemsAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in GetItems.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading warehouse items.", 500));
        }
    }

    [HttpPost("items")]
    public async Task<IActionResult> UpsertItem(UpsertWarehouseItemRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await warehouseService.UpsertItemAsync(request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in UpsertItem.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while saving warehouse item.", 500));
        }
    }
}
