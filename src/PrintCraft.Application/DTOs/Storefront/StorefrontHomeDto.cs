namespace PrintCraft.Application.DTOs.Storefront;

public class StorefrontHomeDto
{
    public IReadOnlyCollection<StorefrontCmsSectionDto> Sections { get; set; } = [];
    public IReadOnlyCollection<StorefrontProductDto> Featured { get; set; } = [];
}

public record StorefrontCmsSectionDto(
    Guid Id,
    string SectionKey,
    string Title,
    string PayloadJson,
    bool IsEnabled,
    int DisplayOrder);

public record StorefrontProductDto(
    Guid Id,
    string Name,
    string Description,
    decimal BasePrice,
    string ModelUrl,
    bool IsVisible,
    Guid? VendorId);
