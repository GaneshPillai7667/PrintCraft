namespace PrintCraft.Application.Services;

public interface IStorefrontAppService
{
    Task<ServiceResponse<object>> GetHomeAsync(CancellationToken cancellationToken = default);
}
