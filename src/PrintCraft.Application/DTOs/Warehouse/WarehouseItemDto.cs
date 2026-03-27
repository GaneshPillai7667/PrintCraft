namespace PrintCraft.Application.DTOs.Warehouse;

public record WarehouseItemDto(
    Guid Id,
    string Sku,
    string Name,
    decimal QuantityInStock,
    decimal ReorderThreshold,
    string Unit);

public class UpsertWarehouseItemRequest
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal QuantityInStock { get; set; }
    public decimal ReorderThreshold { get; set; }
    public string Unit { get; set; } = "pcs";
}
