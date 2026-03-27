using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PrintCraft.Application.Abstractions.Security;
using PrintCraft.Application.DTOs.Auth;
using PrintCraft.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace PrintCraft.Infrastructure.Security;

public class JwtTokenService(IOptions<JwtOptions> options) : IJwtTokenService
{
    private readonly JwtOptions _options = options.Value;

    public AuthTokens GenerateTokens(AppUser user)
    {
        try
        {
            var expires = DateTime.UtcNow.AddMinutes(_options.AccessTokenMinutes);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("tenant_id", user.TenantId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            return new AuthTokens(
                new JwtSecurityTokenHandler().WriteToken(token),
                Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                _options.AccessTokenMinutes * 60);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to generate JWT tokens.", ex);
        }
    }
}
