using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class B2BBulkOrder : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid CustomerId { get; set; }
    public string CsvFileUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public decimal QuotedAmount { get; set; }
    public bool TaxExempt { get; set; }
}
