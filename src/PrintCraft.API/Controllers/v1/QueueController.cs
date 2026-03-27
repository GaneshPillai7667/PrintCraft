using PrintCraft.Application.DTOs.Queue;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize(Roles = "ProductionStaff,TenantAdmin,SuperAdmin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/queue")]
public class QueueController(
    IQueueAppService queueService,
    IHubContext<PrintCraft.API.Hubs.QueueHub> hubContext,
    ILogger<QueueController> logger) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetQueue(CancellationToken cancellationToken)
    {
        try
        {
            var result = await queueService.GetQueueAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in GetQueue.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading queue.", 500));
        }
    }

    [HttpPost("stage")]
    public async Task<IActionResult> UpdateStage(UpdateQueueStageRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await queueService.UpdateStageAsync(request, cancellationToken);
            if (result.Success && result.Data is QueueItemDto item)
            {
                await hubContext.Clients.All.SendAsync("queue-updated", item, cancellationToken);
            }

            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in UpdateStage.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while updating queue stage.", 500));
        }
    }
}
