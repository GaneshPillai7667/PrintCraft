using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/storefront")]
public class StorefrontController(
    IStorefrontAppService storefrontService,
    ILogger<StorefrontController> logger) : ControllerBase
{
    [HttpGet("home")]
    public async Task<IActionResult> Home(CancellationToken cancellationToken)
    {
        try
        {
            var result = await storefrontService.GetHomeAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Home.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading storefront.", 500));
        }
    }
}
