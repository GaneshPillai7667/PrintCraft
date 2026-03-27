using PrintCraft.Application.DTOs.Auth;
using PrintCraft.Domain.Entities;

namespace PrintCraft.Application.Abstractions.Security;

public interface IJwtTokenService
{
    AuthTokens GenerateTokens(AppUser user);
}
