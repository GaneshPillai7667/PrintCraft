using PrintCraft.Application.DTOs.Cms;

namespace PrintCraft.Application.Services;

public interface ICmsAdminAppService
{
    Task<ServiceResponse<object>> GetSectionsAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> UpsertAsync(UpsertCmsSectionRequest request, CancellationToken cancellationToken = default);
}
