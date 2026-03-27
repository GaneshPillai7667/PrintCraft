using AutoMapper;
using PrintCraft.Application.DTOs.B2B;
using PrintCraft.Application.DTOs.Cms;
using PrintCraft.Application.DTOs.Orders;
using PrintCraft.Application.DTOs.Queue;
using PrintCraft.Application.DTOs.Storefront;
using PrintCraft.Application.DTOs.Vendors;
using PrintCraft.Application.DTOs.Warehouse;
using PrintCraft.Domain.Entities;

namespace PrintCraft.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderSummaryDto>()
            .ForCtorParam(nameof(OrderSummaryDto.Priority), x => x.MapFrom(src => src.Priority.ToString()));

        CreateMap<PrintQueueItem, QueueItemDto>()
            .ForCtorParam(nameof(QueueItemDto.Priority), x => x.MapFrom(src => src.Priority.ToString()))
            .ForCtorParam(nameof(QueueItemDto.Stage), x => x.MapFrom(src => src.Stage.ToString()));

        CreateMap<Product, StorefrontProductDto>();
        CreateMap<CmsSection, StorefrontCmsSectionDto>();

        CreateMap<CmsSection, CmsSectionDto>();
        CreateMap<UpsertCmsSectionRequest, CmsSection>();

        CreateMap<Vendor, VendorDto>();
        CreateMap<CreateVendorRequest, Vendor>();

        CreateMap<WarehouseItem, WarehouseItemDto>();
        CreateMap<UpsertWarehouseItemRequest, WarehouseItem>();

        CreateMap<B2BBulkOrder, B2BBulkOrderDto>();
        CreateMap<CreateB2BBulkOrderRequest, B2BBulkOrder>();
    }
}
