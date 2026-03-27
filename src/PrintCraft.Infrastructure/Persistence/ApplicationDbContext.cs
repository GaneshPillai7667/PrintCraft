using PrintCraft.Domain.Common;
using PrintCraft.Domain.Entities;
using PrintCraft.Infrastructure.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace PrintCraft.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, TenantContext tenantContext) : DbContext(options)
{
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<PrintQueueItem> PrintQueueItems => Set<PrintQueueItem>();
    public DbSet<WarehouseItem> WarehouseItems => Set<WarehouseItem>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<CmsSection> CmsSections => Set<CmsSection>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<AiGeneratedDesign> AiGeneratedDesigns => Set<AiGeneratedDesign>();
    public DbSet<B2BBulkOrder> B2BBulkOrders => Set<B2BBulkOrder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(IMultiTenant).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).Property<Guid>("TenantId");
            }
        }

        modelBuilder.Entity<AppUser>().HasIndex(x => new { x.TenantId, x.Email }).IsUnique();
        modelBuilder.Entity<Product>().Property(x => x.BasePrice).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(x => x.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<WarehouseItem>().Property(x => x.QuantityInStock).HasPrecision(18, 3);
        modelBuilder.Entity<WarehouseItem>().Property(x => x.ReorderThreshold).HasPrecision(18, 3);
        modelBuilder.Entity<Vendor>().Property(x => x.CommissionRate).HasPrecision(5, 2);
        modelBuilder.Entity<Tenant>().Property(x => x.RoyaltyPercentage).HasPrecision(5, 2);
        modelBuilder.Entity<OrderItem>().Property(x => x.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<B2BBulkOrder>().Property(x => x.QuotedAmount).HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .HasMany(x => x.Items)
            .WithOne()
            .HasForeignKey(x => x.OrderId);

        modelBuilder.Entity<Tenant>().HasData(new Tenant
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Default Tenant",
            Slug = "default-tenant",
            Subdomain = "default",
            CreatedAtUtc = DateTime.UtcNow,
            PrimaryColor = "#00D4FF",
            SecondaryColor = "#7F5AF0",
            IsActive = true,
            RoyaltyPercentage = 5
        });

        var defaultTenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111001"),
                TenantId = defaultTenantId,
                Name = "Essential T-Shirt",
                Description = "Breathable cotton tee with front and back print zones.",
                BasePrice = 24m,
                IsVisible = true,
                ModelUrl = "/models/tshirt.glb",
                CreatedAtUtc = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111002"),
                TenantId = defaultTenantId,
                Name = "Premium Hoodie",
                Description = "Heavy fleece hoodie built for high-detail custom graphics.",
                BasePrice = 45m,
                IsVisible = true,
                ModelUrl = "/models/hoodie.glb",
                CreatedAtUtc = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111003"),
                TenantId = defaultTenantId,
                Name = "Signature Mug",
                Description = "Ceramic mug with full-wrap UV print support.",
                BasePrice = 19m,
                IsVisible = true,
                ModelUrl = "/models/mug.glb",
                CreatedAtUtc = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc)
            });

        modelBuilder.Entity<CmsSection>().HasData(
            new CmsSection
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-222222222001"),
                TenantId = defaultTenantId,
                SectionKey = "hero",
                Title = "Hero Banner",
                PayloadJson = "{\"headline\":\"Premium 3D Print Commerce\"}",
                IsEnabled = true,
                DisplayOrder = 1,
                CreatedAtUtc = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc)
            },
            new CmsSection
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-222222222002"),
                TenantId = defaultTenantId,
                SectionKey = "featured",
                Title = "Featured Products",
                PayloadJson = "{\"limit\":8}",
                IsEnabled = true,
                DisplayOrder = 2,
                CreatedAtUtc = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc)
            });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
            }

            if (entry.Entity is IMultiTenant multiTenant && multiTenant.TenantId == Guid.Empty && tenantContext.IsResolved)
            {
                multiTenant.TenantId = tenantContext.TenantId;
            }
            else if (entry.Entity is IMultiTenant defaultTenantEntity && defaultTenantEntity.TenantId == Guid.Empty)
            {
                defaultTenantEntity.TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
