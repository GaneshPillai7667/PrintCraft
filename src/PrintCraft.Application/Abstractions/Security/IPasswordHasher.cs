namespace PrintCraft.Application.Abstractions.Security;

public interface IPasswordHasher
{
    string HashPassword(string value);
    bool Verify(string value, string hash);
}
