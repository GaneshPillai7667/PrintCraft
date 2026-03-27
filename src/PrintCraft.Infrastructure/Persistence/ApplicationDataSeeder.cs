using PrintCraft.Application.Abstractions.Security;
using PrintCraft.Domain.Entities;
using PrintCraft.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Infrastructure.Persistence;

public class ApplicationDataSeeder(
    ApplicationDbContext dbContext,
    IPasswordHasher passwordHasher,
    ILogger<ApplicationDataSeeder> logger)
{
    private static readonly Guid DefaultTenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly DateTime SeedTimestampUtc = new(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc);

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await SeedProductsAsync(cancellationToken);
        await SeedCmsSectionsAsync(cancellationToken);
        await SeedUsersAsync(cancellationToken);
        await SeedVendorsAsync(cancellationToken);
        await SeedWarehouseAsync(cancellationToken);
        await SeedOrdersAndQueueAsync(cancellationToken);
        await SeedB2BOrdersAsync(cancellationToken);
    }

    private async Task SeedProductsAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.Products.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.Products.AddRangeAsync(
            [
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111001"),
                TenantId = DefaultTenantId,
                Name = "Essential T-Shirt",
                Description = "Breathable cotton tee with front and back print zones.",
                BasePrice = 24m,
                IsVisible = true,
                ModelUrl = "/models/tshirt.glb",
                CreatedAtUtc = SeedTimestampUtc
            },
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111002"),
                TenantId = DefaultTenantId,
                Name = "Premium Hoodie",
                Description = "Heavy fleece hoodie built for high-detail custom graphics.",
                BasePrice = 45m,
                IsVisible = true,
                ModelUrl = "/models/hoodie.glb",
                CreatedAtUtc = SeedTimestampUtc
            },
            new Product
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111003"),
                TenantId = DefaultTenantId,
                Name = "Signature Mug",
                Description = "Ceramic mug with full-wrap UV print support.",
                BasePrice = 19m,
                IsVisible = true,
                ModelUrl = "/models/mug.glb",
                CreatedAtUtc = SeedTimestampUtc
            }
            ],
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded products.");
    }

    private async Task SeedCmsSectionsAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.CmsSections.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.CmsSections.AddRangeAsync(
            [
            new CmsSection
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-222222222001"),
                TenantId = DefaultTenantId,
                SectionKey = "hero",
                Title = "Hero Banner",
                PayloadJson = "{\"headline\":\"Premium 3D Print Commerce\"}",
                IsEnabled = true,
                DisplayOrder = 1,
                CreatedAtUtc = SeedTimestampUtc
            },
            new CmsSection
            {
                Id = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-222222222002"),
                TenantId = DefaultTenantId,
                SectionKey = "featured",
                Title = "Featured Products",
                PayloadJson = "{\"limit\":8}",
                IsEnabled = true,
                DisplayOrder = 2,
                CreatedAtUtc = SeedTimestampUtc
            }
            ],
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded CMS sections.");
    }

    private async Task SeedUsersAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var defaultPasswordHash = passwordHasher.HashPassword("PrintCraft@123");
        var users = new List<AppUser>
        {
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                FullName = "Super Admin",
                Email = "superadmin@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.SuperAdmin,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000002"),
                TenantId = DefaultTenantId,
                FullName = "Tenant Admin",
                Email = "admin@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.TenantAdmin,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000003"),
                TenantId = DefaultTenantId,
                FullName = "Production Staff",
                Email = "production@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.ProductionStaff,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000004"),
                TenantId = DefaultTenantId,
                FullName = "Warehouse Staff",
                Email = "warehouse@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.WarehouseStaff,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000005"),
                TenantId = DefaultTenantId,
                FullName = "Vendor User",
                Email = "vendor@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.Vendor,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000006"),
                TenantId = DefaultTenantId,
                FullName = "B2B Customer",
                Email = "b2b@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.B2BCustomer,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            },
            new()
            {
                Id = Guid.Parse("70000000-0000-0000-0000-000000000007"),
                TenantId = DefaultTenantId,
                FullName = "Retail Customer",
                Email = "customer@printcraft.local",
                PasswordHash = defaultPasswordHash,
                Role = RoleType.Customer,
                IsActive = true,
                CreatedAtUtc = SeedTimestampUtc
            }
        };

        await dbContext.Users.AddRangeAsync(users, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded default users for all roles.");
    }

    private async Task SeedVendorsAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.Vendors.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.Vendors.AddRangeAsync(
            [
            new Vendor
            {
                Id = Guid.Parse("72000000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                CompanyName = "Northwind Textile Co.",
                ContactEmail = "ops@northwind-textile.local",
                IsApproved = true,
                CommissionRate = 8.5m,
                CreatedAtUtc = SeedTimestampUtc
            },
            new Vendor
            {
                Id = Guid.Parse("72000000-0000-0000-0000-000000000002"),
                TenantId = DefaultTenantId,
                CompanyName = "Summit Ceramic Works",
                ContactEmail = "team@summit-ceramics.local",
                IsApproved = true,
                CommissionRate = 7.25m,
                CreatedAtUtc = SeedTimestampUtc
            }
            ],
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded vendors.");
    }

    private async Task SeedWarehouseAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.WarehouseItems.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.WarehouseItems.AddRangeAsync(
            [
            new WarehouseItem
            {
                Id = Guid.Parse("73000000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                Sku = "BLNK-TEE-M",
                Name = "Blank Cotton Tee (M)",
                QuantityInStock = 320,
                ReorderThreshold = 80,
                Unit = "pcs",
                CreatedAtUtc = SeedTimestampUtc
            },
            new WarehouseItem
            {
                Id = Guid.Parse("73000000-0000-0000-0000-000000000002"),
                TenantId = DefaultTenantId,
                Sku = "BLNK-HOOD-L",
                Name = "Blank Hoodie (L)",
                QuantityInStock = 140,
                ReorderThreshold = 45,
                Unit = "pcs",
                CreatedAtUtc = SeedTimestampUtc
            },
            new WarehouseItem
            {
                Id = Guid.Parse("73000000-0000-0000-0000-000000000003"),
                TenantId = DefaultTenantId,
                Sku = "INK-CMYK-SET",
                Name = "CMYK Ink Set",
                QuantityInStock = 62,
                ReorderThreshold = 15,
                Unit = "set",
                CreatedAtUtc = SeedTimestampUtc
            }
            ],
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded warehouse inventory.");
    }

    private async Task SeedOrdersAndQueueAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.Orders.AnyAsync(cancellationToken) || await dbContext.PrintQueueItems.AnyAsync(cancellationToken))
        {
            return;
        }

        var customerId = Guid.Parse("70000000-0000-0000-0000-000000000007");
        var tShirtId = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111001");
        var hoodieId = Guid.Parse("a0c9e1b1-20b9-4c9a-b3c0-111111111002");

        var order1 = new Order
        {
            Id = Guid.Parse("77129000-0000-0000-0000-000000000001"),
            TenantId = DefaultTenantId,
            CustomerId = customerId,
            TotalAmount = 96m,
            Priority = OrderPriorityType.Express,
            IsExpress = true,
            DueDateUtc = DateTime.UtcNow.AddHours(6),
            ProductionStage = ProductionStage.InProgress,
            Status = "In Production",
            DesignConfigurationJson = "{\"theme\":\"neon\",\"placements\":[\"front\",\"back\"]}",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
        };

        var order2 = new Order
        {
            Id = Guid.Parse("77129000-0000-0000-0000-000000000002"),
            TenantId = DefaultTenantId,
            CustomerId = customerId,
            TotalAmount = 90m,
            Priority = OrderPriorityType.Normal,
            IsExpress = false,
            DueDateUtc = DateTime.UtcNow.AddHours(20),
            ProductionStage = ProductionStage.Queued,
            Status = "Queued",
            DesignConfigurationJson = "{\"theme\":\"minimal\",\"placements\":[\"front\"]}",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-1)
        };

        await dbContext.Orders.AddRangeAsync([order1, order2], cancellationToken);

        await dbContext.OrderItems.AddRangeAsync(
            [
            new OrderItem
            {
                Id = Guid.Parse("74100000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                OrderId = order1.Id,
                ProductId = tShirtId,
                Quantity = 4,
                UnitPrice = 24m,
                CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
            },
            new OrderItem
            {
                Id = Guid.Parse("74100000-0000-0000-0000-000000000002"),
                TenantId = DefaultTenantId,
                OrderId = order2.Id,
                ProductId = hoodieId,
                Quantity = 2,
                UnitPrice = 45m,
                CreatedAtUtc = DateTime.UtcNow.AddHours(-1)
            }
            ],
            cancellationToken);

        await dbContext.PrintQueueItems.AddRangeAsync(
            [
            new PrintQueueItem
            {
                Id = Guid.Parse("74200000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                OrderId = order1.Id,
                QueuePosition = 1,
                Priority = OrderPriorityType.Express,
                DueDateUtc = order1.DueDateUtc,
                Stage = ProductionStage.InProgress,
                AssignedToUserId = Guid.Parse("70000000-0000-0000-0000-000000000003"),
                CreatedAtUtc = DateTime.UtcNow.AddHours(-2)
            },
            new PrintQueueItem
            {
                Id = Guid.Parse("74200000-0000-0000-0000-000000000002"),
                TenantId = DefaultTenantId,
                OrderId = order2.Id,
                QueuePosition = 2,
                Priority = OrderPriorityType.Normal,
                DueDateUtc = order2.DueDateUtc,
                Stage = ProductionStage.Queued,
                CreatedAtUtc = DateTime.UtcNow.AddHours(-1)
            }
            ],
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded sample orders and queue items.");
    }

    private async Task SeedB2BOrdersAsync(CancellationToken cancellationToken)
    {
        if (await dbContext.B2BBulkOrders.AnyAsync(cancellationToken))
        {
            return;
        }

        await dbContext.B2BBulkOrders.AddAsync(
            new B2BBulkOrder
            {
                Id = Guid.Parse("75000000-0000-0000-0000-000000000001"),
                TenantId = DefaultTenantId,
                CustomerId = Guid.Parse("70000000-0000-0000-0000-000000000006"),
                CsvFileUrl = "https://files.printcraft.local/b2b/orders/template-order.csv",
                Status = "Quoted",
                QuotedAmount = 1240m,
                TaxExempt = true,
                CreatedAtUtc = DateTime.UtcNow.AddDays(-1)
            },
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded B2B bulk order data.");
    }
}
