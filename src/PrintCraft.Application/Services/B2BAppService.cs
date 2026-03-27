using AutoMapper;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.B2B;
using PrintCraft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class B2BAppService(
    IRepository<B2BBulkOrder> repository,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    ILogger<B2BAppService> logger) : IB2BAppService
{
    public async Task<ServiceResponse<object>> GetBulkOrdersAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var orders = await repository.Query().OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<List<B2BBulkOrderDto>>(orders), "Bulk orders loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load bulk orders.");
            return ServiceResponse<object>.Fail("Unable to load bulk orders.", 500);
        }
    }

    public async Task<ServiceResponse<object>> CreateBulkOrderAsync(CreateB2BBulkOrderRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var order = mapper.Map<B2BBulkOrder>(request);
            await repository.AddAsync(order, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return ServiceResponse<object>.Created(mapper.Map<B2BBulkOrderDto>(order), "Bulk order created.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to create bulk order.");
            return ServiceResponse<object>.Fail("Unable to create bulk order.", 500);
        }
    }
}
