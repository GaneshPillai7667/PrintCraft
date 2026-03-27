namespace PrintCraft.Application.DTOs.Auth;

public record AdminUserDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsActive,
    DateTime CreatedAtUtc);
