using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace IntranetPortal.Application.Services;

/// <summary>
/// JWT Token service implementation
/// Reference: TECHNICAL_DESIGN.md Section 2.1
/// Algorithm: HMAC-SHA256
/// Token Expiry: 8 hours (configurable)
/// Storage: HttpOnly Cookie (NOT localStorage - SECURITY_ANALYSIS_REPORT.md Finding #2)
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiryMinutes;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;

        // Load JWT settings from configuration (User Secrets in development)
        _secretKey = _configuration["JwtSettings:SecretKey"]
            ?? throw new InvalidOperationException("JWT Secret Key is not configured. Use User Secrets.");
        _issuer = _configuration["JwtSettings:Issuer"] ?? "IntranetPortal";
        _audience = _configuration["JwtSettings:Audience"] ?? "IntranetUsers";
        _expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "480"); // Default: 8 hours
    }

    /// <summary>
    /// Generates JWT access token with user, birim, and role claims
    /// </summary>
    public string GenerateToken(User user, Birim birim, Role role)
    {
        // Validate inputs
        if (user == null) throw new ArgumentNullException(nameof(user));
        if (birim == null) throw new ArgumentNullException(nameof(birim));
        if (role == null) throw new ArgumentNullException(nameof(role));

        // Create claims (Reference: TECHNICAL_DESIGN.md Section 2.1)
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
            new Claim("sicil", user.Sicil),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token ID
            new Claim("userId", user.UserID.ToString()),
            new Claim("adSoyad", user.AdSoyad),
            new Claim("birimId", birim.BirimID.ToString()),
            new Claim("birimAdi", birim.BirimAdi),
            new Claim("roleId", role.RoleID.ToString()),
            new Claim("roleName", role.RoleAdi)
        };

        // Create signing credentials with HMAC-SHA256
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_expiryMinutes),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = credentials
        };

        // Generate token
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    /// <summary>
    /// Validates JWT token and returns ClaimsPrincipal
    /// </summary>
    public ClaimsPrincipal? ValidateToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // No tolerance for expiration
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            // Verify algorithm is HMAC-SHA256 (prevent algorithm substitution attacks)
            if (validatedToken is JwtSecurityToken jwtToken &&
                jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return principal;
            }

            return null;
        }
        catch (SecurityTokenException)
        {
            // Token validation failed (expired, invalid signature, etc.)
            return null;
        }
        catch (Exception)
        {
            // Other errors during validation
            return null;
        }
    }

    /// <summary>
    /// Extracts user ID from claims
    /// </summary>
    public int? GetUserIdFromClaims(ClaimsPrincipal claimsPrincipal)
    {
        var userIdClaim = claimsPrincipal?.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    /// <summary>
    /// Extracts birim ID from claims
    /// </summary>
    public int? GetBirimIdFromClaims(ClaimsPrincipal claimsPrincipal)
    {
        var birimIdClaim = claimsPrincipal?.FindFirst("birimId")?.Value;
        return int.TryParse(birimIdClaim, out var birimId) ? birimId : null;
    }

    /// <summary>
    /// Extracts role ID from claims
    /// </summary>
    public int? GetRoleIdFromClaims(ClaimsPrincipal claimsPrincipal)
    {
        var roleIdClaim = claimsPrincipal?.FindFirst("roleId")?.Value;
        return int.TryParse(roleIdClaim, out var roleId) ? roleId : null;
    }
}
