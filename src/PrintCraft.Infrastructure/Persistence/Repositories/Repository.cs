using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Domain.Common;
using Microsoft.EntityFrameworkCore;
using PrintCraft.Infrastructure.Tenancy;

namespace PrintCraft.Infrastructure.Persistence.Repositories;

public class Repository<T>(ApplicationDbContext context, TenantContext tenantContext) : IRepository<T> where T : BaseEntity
{
    public IQueryable<T> Query()
    {
        try
        {
            var query = context.Set<T>().AsQueryable();
            if (typeof(IMultiTenant).IsAssignableFrom(typeof(T)) && tenantContext.IsResolved)
            {
                query = query.Where(x => EF.Property<Guid>(x, nameof(IMultiTenant.TenantId)) == tenantContext.TenantId);
            }

            return query;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to build query for entity '{typeof(T).Name}'.", ex);
        }
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            return await context.Set<T>().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to get entity '{typeof(T).Name}' by id '{id}'.", ex);
        }
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        try
        {
            await context.Set<T>().AddAsync(entity, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to add entity '{typeof(T).Name}'.", ex);
        }
    }

    public void Update(T entity)
    {
        try
        {
            context.Set<T>().Update(entity);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to update entity '{typeof(T).Name}'.", ex);
        }
    }
}
