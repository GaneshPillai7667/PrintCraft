using AutoMapper;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.Cms;
using PrintCraft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class CmsAdminAppService(
    IRepository<CmsSection> cmsRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    ILogger<CmsAdminAppService> logger) : ICmsAdminAppService
{
    public async Task<ServiceResponse<object>> GetSectionsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var sections = await cmsRepository.Query().OrderBy(x => x.DisplayOrder).ToListAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<List<CmsSectionDto>>(sections), "CMS sections loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to get CMS sections.");
            return ServiceResponse<object>.Fail("Unable to load CMS sections.", 500);
        }
    }

    public async Task<ServiceResponse<object>> UpsertAsync(UpsertCmsSectionRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var existing = await cmsRepository.GetByIdAsync(request.Id, cancellationToken);
            if (existing is null)
            {
                var section = mapper.Map<CmsSection>(request);
                await cmsRepository.AddAsync(section, cancellationToken);
                await unitOfWork.SaveChangesAsync(cancellationToken);
                return ServiceResponse<object>.Ok(mapper.Map<CmsSectionDto>(section), "CMS section saved.");
            }

            existing.SectionKey = request.SectionKey;
            existing.Title = request.Title;
            existing.PayloadJson = request.PayloadJson;
            existing.DisplayOrder = request.DisplayOrder;
            existing.IsEnabled = request.IsEnabled;
            cmsRepository.Update(existing);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<CmsSectionDto>(existing), "CMS section saved.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upsert CMS section {SectionId}", request.Id);
            return ServiceResponse<object>.Fail("Unable to save CMS section.", 500);
        }
    }
}
