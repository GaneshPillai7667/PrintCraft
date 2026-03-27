namespace PrintCraft.Application.DTOs.Cms;

public record CmsSectionDto(
    Guid Id,
    string SectionKey,
    string Title,
    string PayloadJson,
    bool IsEnabled,
    int DisplayOrder);

public class UpsertCmsSectionRequest
{
    public Guid Id { get; set; }
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public bool IsEnabled { get; set; } = true;
    public int DisplayOrder { get; set; }
}
