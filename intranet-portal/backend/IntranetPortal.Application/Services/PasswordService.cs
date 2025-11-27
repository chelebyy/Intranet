using System.Text.RegularExpressions;
using IntranetPortal.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Password service implementation using BCrypt
/// Reference: TECHNICAL_DESIGN.md Section 2.3
/// Work Factor: 12 (good balance between security and performance)
/// </summary>
public class PasswordService : IPasswordService
{
    private readonly int _workFactor;
    private readonly int _minLength;
    private readonly bool _requireUppercase;
    private readonly bool _requireLowercase;
    private readonly bool _requireDigit;
    private readonly bool _requireSpecialChar;

    public PasswordService(IConfiguration configuration)
    {
        // Load password policy from configuration
        _workFactor = int.Parse(configuration["SecuritySettings:BCryptWorkFactor"] ?? "12");
        _minLength = int.Parse(configuration["SecuritySettings:PasswordPolicy:MinLength"] ?? "12");
        _requireUppercase = bool.Parse(configuration["SecuritySettings:PasswordPolicy:RequireUppercase"] ?? "true");
        _requireLowercase = bool.Parse(configuration["SecuritySettings:PasswordPolicy:RequireLowercase"] ?? "true");
        _requireDigit = bool.Parse(configuration["SecuritySettings:PasswordPolicy:RequireDigit"] ?? "true");
        _requireSpecialChar = bool.Parse(configuration["SecuritySettings:PasswordPolicy:RequireSpecialChar"] ?? "true");
    }

    /// <summary>
    /// Hashes password using BCrypt with configured work factor
    /// </summary>
    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty", nameof(password));

        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: _workFactor);
    }

    /// <summary>
    /// Verifies password against BCrypt hash
    /// </summary>
    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
            return false;

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (Exception)
        {
            // Invalid hash format or BCrypt error
            return false;
        }
    }

    /// <summary>
    /// Validates password strength according to configured policy
    /// Reference: appsettings.json SecuritySettings:PasswordPolicy
    /// </summary>
    public (bool IsValid, string? ValidationMessage) ValidatePasswordStrength(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Şifre boş olamaz");

        // Check minimum length
        if (password.Length < _minLength)
            return (false, $"Şifre en az {_minLength} karakter olmalıdır");

        // Check uppercase requirement
        if (_requireUppercase && !Regex.IsMatch(password, @"[A-Z]"))
            return (false, "Şifre en az bir büyük harf içermelidir");

        // Check lowercase requirement
        if (_requireLowercase && !Regex.IsMatch(password, @"[a-z]"))
            return (false, "Şifre en az bir küçük harf içermelidir");

        // Check digit requirement
        if (_requireDigit && !Regex.IsMatch(password, @"[0-9]"))
            return (false, "Şifre en az bir rakam içermelidir");

        // Check special character requirement
        if (_requireSpecialChar && !Regex.IsMatch(password, @"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]"))
            return (false, "Şifre en az bir özel karakter içermelidir (!@#$%^&* vb.)");

        // Optional: Check against common passwords (OWASP recommendation)
        // This could be expanded with a blacklist from SECURITY_ANALYSIS_REPORT.md Finding #6
        var commonPasswords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Password123!", "Admin123!", "Welcome123!", "Qwerty123!",
            "12345678", "password", "123456789", "12345"
        };

        if (commonPasswords.Contains(password))
            return (false, "Bu şifre çok yaygın kullanılmaktadır, lütfen daha güçlü bir şifre seçin");

        return (true, null);
    }
}
