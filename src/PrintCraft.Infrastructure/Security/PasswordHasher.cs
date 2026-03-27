using PrintCraft.Application.Abstractions.Security;

namespace PrintCraft.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string value)
    {
        try
        {
            return BCrypt.Net.BCrypt.HashPassword(value);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to hash password.", ex);
        }
    }

    public bool Verify(string value, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(value, hash);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to verify password hash.", ex);
        }
    }
}
