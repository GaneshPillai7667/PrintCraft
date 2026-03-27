using PrintCraft.Domain.Common;
using PrintCraft.Domain.Enums;

namespace PrintCraft.Domain.Entities;

public class AppUser : BaseEntity, IMultiTenant
{
    public Guid TenantId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public RoleType Role { get; set; }
    public bool IsActive { get; set; } = true;
}
