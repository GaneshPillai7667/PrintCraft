using PrintCraft.Application.DTOs.Cms;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[Authorize(Roles = "TenantAdmin,SuperAdmin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/cms")]
public class CmsAdminController(
    ICmsAdminAppService cmsAdminService,
    ILogger<CmsAdminController> logger) : ControllerBase
{
    [HttpGet("sections")]
    public async Task<IActionResult> GetSections(CancellationToken cancellationToken)
    {
        try
        {
            var result = await cmsAdminService.GetSectionsAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in GetSections.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading CMS sections.", 500));
        }
    }

    [HttpPost("sections")]
    public async Task<IActionResult> Upsert(UpsertCmsSectionRequest section, CancellationToken cancellationToken)
    {
        try
        {
            var result = await cmsAdminService.UpsertAsync(section, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Upsert CMS section.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while saving CMS section.", 500));
        }
    }
}
