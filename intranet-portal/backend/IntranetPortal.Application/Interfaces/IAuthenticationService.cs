using IntranetPortal.Application.DTOs;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Authentication service interface
/// Reference: API_SPECIFICATION.md Section 2.1, TECHNICAL_DESIGN.md Section 2.1
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Authenticates user with sicil (registration number) and password
    /// Returns user info and list of associated birims (organizational units)
    /// </summary>
    /// <param name="sicil">User sicil (registration number)</param>
    /// <param name="password">User password (plaintext)</param>
    /// <param name="ipAddress">Client IP address for audit logging</param>
    /// <returns>Login response with user and birim list</returns>
    Task<LoginResponseDto> LoginAsync(string sicil, string password, string ipAddress);

    /// <summary>
    /// Selects a specific birim for multi-birim users
    /// Generates new JWT token with selected birim and role
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="birimId">Selected birim ID</param>
    /// <returns>Login response with selected birim and role</returns>
    Task<LoginResponseDto> SelectBirimAsync(int userId, int birimId);

    /// <summary>
    /// Logs out user and invalidates session
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="ipAddress">Client IP address for audit logging</param>
    Task LogoutAsync(int userId, string ipAddress);

    /// <summary>
    /// Gets current authenticated user information
    /// </summary>
    /// <param name="userId">User ID from JWT claims</param>
    /// <returns>User DTO</returns>
    Task<UserDto?> GetCurrentUserAsync(int userId);

    /// <summary>
    /// Updates user's last login timestamp
    /// </summary>
    /// <param name="userId">User ID</param>
    Task UpdateLastLoginAsync(int userId);
}
