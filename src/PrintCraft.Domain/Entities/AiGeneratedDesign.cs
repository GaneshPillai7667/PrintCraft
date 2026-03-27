using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class AiGeneratedDesign : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string GeneratedAssetUrl { get; set; } = string.Empty;
    public string MetadataJson { get; set; } = "{}";
}
