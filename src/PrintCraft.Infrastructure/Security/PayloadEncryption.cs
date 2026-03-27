using System.Security.Cryptography;
using System.Text;

namespace PrintCraft.Infrastructure.Security;

public static class PayloadEncryption
{
    public static string Encrypt(string plainText, string key)
    {
        using var aes = Aes.Create();
        aes.Key = SHA256.HashData(Encoding.UTF8.GetBytes(key));
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        var input = Encoding.UTF8.GetBytes(plainText);
        var cipher = encryptor.TransformFinalBlock(input, 0, input.Length);

        return Convert.ToBase64String(aes.IV.Concat(cipher).ToArray());
    }
}
