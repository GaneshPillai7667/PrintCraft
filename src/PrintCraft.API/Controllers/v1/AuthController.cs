using PrintCraft.Application.DTOs.Auth;
using PrintCraft.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PrintCraft.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController(
    IAuthAppService authService,
    ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await authService.RegisterAsync(request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Register.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while registering.", 500));
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await authService.LoginAsync(request, cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in Login.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while logging in.", 500));
        }
    }

    [Authorize(Roles = "TenantAdmin,SuperAdmin")]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
    {
        try
        {
            var result = await authService.GetUsersAsync(cancellationToken);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled error in GetUsers.");
            return StatusCode(500, ServiceResponse<object>.Fail("Unexpected error while loading users.", 500));
        }
    }
}
