using AutoMapper;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.Warehouse;
using PrintCraft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class WarehouseAppService(
    IRepository<WarehouseItem> warehouseRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    ILogger<WarehouseAppService> logger) : IWarehouseAppService
{
    public async Task<ServiceResponse<object>> GetItemsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var items = await warehouseRepository.Query().OrderBy(x => x.Name).ToListAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<List<WarehouseItemDto>>(items), "Warehouse items loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load warehouse items.");
            return ServiceResponse<object>.Fail("Unable to load warehouse items.", 500);
        }
    }

    public async Task<ServiceResponse<object>> UpsertItemAsync(UpsertWarehouseItemRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var existing = await warehouseRepository.GetByIdAsync(request.Id, cancellationToken);
            if (existing is null)
            {
                var item = mapper.Map<WarehouseItem>(request);
                await warehouseRepository.AddAsync(item, cancellationToken);
                await unitOfWork.SaveChangesAsync(cancellationToken);
                return ServiceResponse<object>.Ok(mapper.Map<WarehouseItemDto>(item), "Warehouse item saved.");
            }

            existing.Sku = request.Sku;
            existing.Name = request.Name;
            existing.QuantityInStock = request.QuantityInStock;
            existing.ReorderThreshold = request.ReorderThreshold;
            existing.Unit = request.Unit;
            warehouseRepository.Update(existing);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<WarehouseItemDto>(existing), "Warehouse item saved.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upsert warehouse item {ItemId}", request.Id);
            return ServiceResponse<object>.Fail("Unable to save warehouse item.", 500);
        }
    }
}
