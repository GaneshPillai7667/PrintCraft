using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class CmsSection : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public bool IsEnabled { get; set; } = true;
    public int DisplayOrder { get; set; }
}
