using PrintCraft.Application.DTOs.Queue;

namespace PrintCraft.Application.Services;

public interface IQueueAppService
{
    Task<ServiceResponse<object>> GetQueueAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse<object>> UpdateStageAsync(UpdateQueueStageRequest request, CancellationToken cancellationToken = default);
}
