using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.Abstractions.Security;
using PrintCraft.Application.Abstractions.Tenancy;
using PrintCraft.Infrastructure.Middleware;
using PrintCraft.Infrastructure.Persistence;
using PrintCraft.Infrastructure.Persistence.Repositories;
using PrintCraft.Infrastructure.Security;
using PrintCraft.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PrintCraft.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            var provider = (configuration["Database:Provider"] ?? "sqlite").ToLowerInvariant();
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? string.Empty;

            var usePostgres = provider is "postgres" or "supabase"
                              && !connectionString.Contains("<your-project-ref>", StringComparison.OrdinalIgnoreCase)
                              && !string.IsNullOrWhiteSpace(connectionString);

            if (usePostgres)
            {
                options.UseNpgsql(connectionString);
            }
            else
            {
                options.UseSqlite("Data Source=AppData/futureprint.db");
            }
        });

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ApplicationDataSeeder>();

        services.AddScoped<TenantContext>();
        services.AddScoped<ICurrentTenant>(sp => sp.GetRequiredService<TenantContext>());

        return services;
    }

    public static IServiceCollection AddRedisCaching(this IServiceCollection services, IConfiguration configuration)
    {
        var redis = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrWhiteSpace(redis))
        {
            services.AddStackExchangeRedisCache(options => options.Configuration = redis);
        }

        return services;
    }
}
