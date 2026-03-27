using PrintCraft.Application.DTOs.Auth;

namespace PrintCraft.Application.Services;

public interface IAuthAppService
{
    Task<ServiceResponse<object>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> GetUsersAsync(CancellationToken cancellationToken = default);
}
