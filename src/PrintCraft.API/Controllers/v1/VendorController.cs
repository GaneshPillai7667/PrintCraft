using PrintCraft.Application.DTOs.Vendors;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize(Roles = "Vendor,TenantAdmin,SuperAdmin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/vendors")]
public class VendorController(
    IVendorAppService vendorService,
    ILogger<VendorController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var result = await vendorService.GetAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Get vendors.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading vendors.", 500));
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateVendorRequest vendor, CancellationToken cancellationToken)
    {
        try
        {
            var result = await vendorService.CreateAsync(vendor, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Create vendor.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while creating vendor.", 500));
        }
    }
}
