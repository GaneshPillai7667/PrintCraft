using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PrintCraft.Application.Services;

namespace PrintCraft.Application.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(ServiceCollectionExtensions).Assembly);
        services.AddAutoMapper(typeof(ServiceCollectionExtensions).Assembly);
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IAuthAppService, AuthAppService>();
        services.AddScoped<IStorefrontAppService, StorefrontAppService>();
        services.AddScoped<IQueueAppService, QueueAppService>();
        services.AddScoped<ICmsAdminAppService, CmsAdminAppService>();
        services.AddScoped<IVendorAppService, VendorAppService>();
        services.AddScoped<IWarehouseAppService, WarehouseAppService>();
        services.AddScoped<IB2BAppService, B2BAppService>();

        return services;
    }
}
