namespace PrintCraft.Application.DTOs.Vendors;

public record VendorDto(
    Guid Id,
    string CompanyName,
    string ContactEmail,
    bool IsApproved,
    decimal CommissionRate);

public class CreateVendorRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public decimal CommissionRate { get; set; }
}
