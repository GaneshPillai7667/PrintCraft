using AutoMapper;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.Queue;
using PrintCraft.Domain.Entities;
using PrintCraft.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class QueueAppService(
    IRepository<PrintQueueItem> queueRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    ILogger<QueueAppService> logger) : IQueueAppService
{
    public async Task<ServiceResponse<object>> GetQueueAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var queue = await queueRepository.Query()
                .OrderBy(x => x.QueuePosition)
                .ThenBy(x => x.DueDateUtc)
                .ToListAsync(cancellationToken);

            return ServiceResponse<object>.Ok(mapper.Map<List<QueueItemDto>>(queue), "Queue loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load queue.");
            return ServiceResponse<object>.Fail("Unable to load queue.", 500);
        }
    }

    public async Task<ServiceResponse<object>> UpdateStageAsync(UpdateQueueStageRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var item = await queueRepository.GetByIdAsync(request.QueueItemId, cancellationToken);
            if (item is null)
            {
                return ServiceResponse<object>.Fail("Queue item not found.", 404);
            }

            item.Stage = request.Stage;
            if (request.Stage == ProductionStage.Completed)
            {
                item.QueuePosition = int.MaxValue;
            }

            queueRepository.Update(item);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return ServiceResponse<object>.Ok(mapper.Map<QueueItemDto>(item), "Queue stage updated.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to update queue stage for item {QueueItemId}", request.QueueItemId);
            return ServiceResponse<object>.Fail("Unable to update queue stage.", 500);
        }
    }
}
