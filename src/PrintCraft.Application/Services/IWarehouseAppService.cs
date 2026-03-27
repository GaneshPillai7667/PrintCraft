using PrintCraft.Application.DTOs.Warehouse;

namespace PrintCraft.Application.Services;

public interface IWarehouseAppService
{
    Task<ServiceResponse<object>> GetItemsAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> UpsertItemAsync(UpsertWarehouseItemRequest request, CancellationToken cancellationToken = default);
}
