using PrintCraft.Application.DTOs.Vendors;

namespace PrintCraft.Application.Services;

public interface IVendorAppService
{
    Task<ServiceResponse<object>> GetAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> CreateAsync(CreateVendorRequest request, CancellationToken cancellationToken = default);
}
