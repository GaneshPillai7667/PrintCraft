using PrintCraft.Application.Abstractions.Persistence;
using PrintCraft.Application.Abstractions.Security;
using PrintCraft.Application.Abstractions.Tenancy;
using PrintCraft.Application.DTOs.Auth;
using PrintCraft.Domain.Entities;
using PrintCraft.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace PrintCraft.Application.Services;

public class AuthAppService(
    IRepository<AppUser> userRepository,
    IRepository<RefreshToken> refreshTokenRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    ICurrentTenant currentTenant,
    IUnitOfWork unitOfWork,
    ILogger<AuthAppService> logger) : IAuthAppService
{
    public async Task<ServiceResponse<object>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var exists = await userRepository.Query().AnyAsync(x => x.Email == request.Email, cancellationToken);
            if (exists)
            {
                return ServiceResponse<object>.Fail("Email already exists", 409);
            }

            _ = Enum.TryParse<RoleType>(request.Role, true, out var role);
            var user = new AppUser
            {
                TenantId = currentTenant.IsResolved ? currentTenant.TenantId : Guid.Parse("11111111-1111-1111-1111-111111111111"),
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = passwordHasher.HashPassword(request.Password),
                Role = role == default ? RoleType.Customer : role
            };

            await userRepository.AddAsync(user, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return ServiceResponse<object>.Created(new { user.Id, user.Email, user.Role }, "User registered successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to register user with email {Email}", request.Email);
            return ServiceResponse<object>.Fail("Unable to register user at the moment.", 500);
        }
    }

    public async Task<ServiceResponse<object>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await userRepository.Query().FirstOrDefaultAsync(x => x.Email == request.Email && x.IsActive, cancellationToken);
            if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
            {
                return ServiceResponse<object>.Fail("Invalid credentials", 401);
            }

            var tokens = jwtTokenService.GenerateTokens(user);

            await refreshTokenRepository.AddAsync(new RefreshToken
            {
                TenantId = user.TenantId,
                UserId = user.Id,
                Token = tokens.RefreshToken,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
            }, cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);
            return ServiceResponse<object>.Ok(tokens, "Login successful.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to login user with email {Email}", request.Email);
            return ServiceResponse<object>.Fail("Unable to login at the moment.", 500);
        }
    }

    public async Task<ServiceResponse<object>> GetUsersAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var users = await userRepository.Query()
                .OrderByDescending(x => x.CreatedAtUtc)
                .Select(x => new AdminUserDto(
                    x.Id,
                    x.FullName,
                    x.Email,
                    x.Role.ToString(),
                    x.IsActive,
                    x.CreatedAtUtc))
                .ToListAsync(cancellationToken);

            return ServiceResponse<object>.Ok(users, "Users loaded successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load users list.");
            return ServiceResponse<object>.Fail("Unable to load users at the moment.", 500);
        }
    }
}
