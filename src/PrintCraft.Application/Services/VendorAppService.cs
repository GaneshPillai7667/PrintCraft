using AutoMapper;
using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.DTOs.Vendors;
using PrintCraft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class VendorAppService(
    IRepository<Vendor> vendorRepository,
    IMapper mapper,
    IUnitOfWork unitOfWork,
    ILogger<VendorAppService> logger) : IVendorAppService
{
    public async Task<ServiceResponse<object>> GetAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var vendors = await vendorRepository.Query().ToListAsync(cancellationToken);
            return ServiceResponse<object>.Ok(mapper.Map<List<VendorDto>>(vendors), "Vendors loaded.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load vendors.");
            return ServiceResponse<object>.Fail("Unable to load vendors.", 500);
        }
    }

    public async Task<ServiceResponse<object>> CreateAsync(CreateVendorRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var vendor = mapper.Map<Vendor>(request);
            await vendorRepository.AddAsync(vendor, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return ServiceResponse<object>.Created(mapper.Map<VendorDto>(vendor), "Vendor created.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to create vendor.");
            return ServiceResponse<object>.Fail("Unable to create vendor.", 500);
        }
    }
}
