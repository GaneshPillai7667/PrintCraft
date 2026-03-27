using PrintCraft.Domain.Common;

namespace PrintCraft.Domain.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Subdomain { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = "#00D4FF";
    public string SecondaryColor { get; set; } = "#7F5AF0";
    public bool IsActive { get; set; } = true;
    public decimal RoyaltyPercentage { get; set; }
}
