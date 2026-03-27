using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class Product : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsVisible { get; set; } = true;
    public string ModelUrl { get; set; } = string.Empty;
    public Guid? VendorId { get; set; }
}
