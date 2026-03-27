using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class RefreshToken : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool IsRevoked { get; set; }
}
