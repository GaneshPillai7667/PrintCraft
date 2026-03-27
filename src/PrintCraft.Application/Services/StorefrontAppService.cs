using AutoMapper;
using PrintCraft.Application.DTOs.Storefront;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class StorefrontAppService(
    IRepository<CmsSection> cmsRepository,
    IRepository<Product> productRepository,
    IMapper mapper,
    ILogger<StorefrontAppService> logger) : IStorefrontAppService
{
    public async Task<ServiceResponse<object>> GetHomeAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var sections = await cmsRepository.Query()
                .Where(x => x.IsEnabled)
                .OrderBy(x => x.DisplayOrder)
                .ToListAsync(cancellationToken);
            var featured = await productRepository.Query()
                .Where(x => x.IsVisible)
                .Take(12)
                .ToListAsync(cancellationToken);

            var payload = new StorefrontHomeDto
            {
                Sections = mapper.Map<IReadOnlyCollection<StorefrontCmsSectionDto>>(sections),
                Featured = mapper.Map<IReadOnlyCollection<StorefrontProductDto>>(featured)
            };

            return ServiceResponse<object>.Ok(payload, "Storefront home loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load storefront home data.");
            return ServiceResponse<object>.Fail("Unable to load storefront data.", 500);
        }
    }
}
