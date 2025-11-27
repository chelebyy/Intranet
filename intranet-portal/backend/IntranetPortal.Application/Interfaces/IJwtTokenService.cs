using System.Security.Claims;
using IntranetPortal.Domain.Entities;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// JWT Token generation and validation service
/// Reference: TECHNICAL_DESIGN.md Section 2.1, SECURITY_ANALYSIS_REPORT.md Finding #2
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Generates JWT access token for authenticated user
    /// </summary>
    /// <param name="user">Authenticated user</param>
    /// <param name="birim">Selected organizational unit</param>
    /// <param name="role">User's role in the selected unit</param>
    /// <returns>JWT token string</returns>
    string GenerateToken(User user, Birim birim, Role role);

    /// <summary>
    /// Validates JWT token and extracts claims
    /// </summary>
    /// <param name="token">JWT token to validate</param>
    /// <returns>ClaimsPrincipal if valid, null otherwise</returns>
    ClaimsPrincipal? ValidateToken(string token);

    /// <summary>
    /// Extracts user ID from JWT token claims
    /// </summary>
    /// <param name="claimsPrincipal">Claims principal from validated token</param>
    /// <returns>User ID if found, null otherwise</returns>
    int? GetUserIdFromClaims(ClaimsPrincipal claimsPrincipal);

    /// <summary>
    /// Extracts birim ID from JWT token claims
    /// </summary>
    /// <param name="claimsPrincipal">Claims principal from validated token</param>
    /// <returns>Birim ID if found, null otherwise</returns>
    int? GetBirimIdFromClaims(ClaimsPrincipal claimsPrincipal);

    /// <summary>
    /// Extracts role ID from JWT token claims
    /// </summary>
    /// <param name="claimsPrincipal">Claims principal from validated token</param>
    /// <returns>Role ID if found, null otherwise</returns>
    int? GetRoleIdFromClaims(ClaimsPrincipal claimsPrincipal);
}
