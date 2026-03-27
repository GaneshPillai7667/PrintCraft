namespace PrintCraft.Application.DTOs.Auth;

public record AuthTokens(string AccessToken, string RefreshToken, int ExpiresInSeconds);
