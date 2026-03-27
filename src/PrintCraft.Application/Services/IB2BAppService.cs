using PrintCraft.Application.DTOs.B2B;

namespace PrintCraft.Application.Services;

public interface IB2BAppService
{
    Task<ServiceResponse<object>> GetBulkOrdersAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> CreateBulkOrderAsync(CreateB2BBulkOrderRequest request, CancellationToken cancellationToken = default);
}
