namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Password hashing and validation service
/// Reference: TECHNICAL_DESIGN.md Section 2.3
/// Algorithm: BCrypt
/// Work Factor: 12 (configured in appsettings)
/// </summary>
public interface IPasswordService
{
    /// <summary>
    /// Hashes a plaintext password using BCrypt
    /// </summary>
    /// <param name="password">Plaintext password</param>
    /// <returns>BCrypt hashed password</returns>
    string HashPassword(string password);

    /// <summary>
    /// Verifies a plaintext password against a BCrypt hash
    /// </summary>
    /// <param name="password">Plaintext password to verify</param>
    /// <param name="hash">BCrypt hash to compare against</param>
    /// <returns>True if password matches hash, false otherwise</returns>
    bool VerifyPassword(string password, string hash);

    /// <summary>
    /// Validates password strength against configured policy
    /// Reference: appsettings.json SecuritySettings:PasswordPolicy
    /// </summary>
    /// <param name="password">Password to validate</param>
    /// <returns>Tuple of (isValid, validationMessage)</returns>
    (bool IsValid, string? ValidationMessage) ValidatePasswordStrength(string password);
}
