namespace PrintCraft.Application.DTOs.B2B;

public record B2BBulkOrderDto(
    Guid Id,
    Guid CustomerId,
    string CsvFileUrl,
    string Status,
    decimal QuotedAmount,
    bool TaxExempt,
    DateTime CreatedAtUtc);

public class CreateB2BBulkOrderRequest
{
    public Guid CustomerId { get; set; }
    public string CsvFileUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public decimal QuotedAmount { get; set; }
    public bool TaxExempt { get; set; }
}
