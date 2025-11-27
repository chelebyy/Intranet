using System.Text.Json;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using IntranetPortal.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Authentication service implementation
/// Reference: API_SPECIFICATION.md Section 2.1, TECHNICAL_DESIGN.md Section 2.1
/// Handles login, logout, birim selection, and audit logging
/// </summary>
public class AuthenticationService : IAuthenticationService
{
    private readonly IIntranetDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        IIntranetDbContext context,
        IPasswordService passwordService,
        IJwtTokenService jwtTokenService,
        ILogger<AuthenticationService> logger)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    /// <summary>
    /// Authenticates user with email and password
    /// Reference: TECHNICAL_DESIGN.md Section 2.1 - Login Flow
    /// </summary>
    public async Task<LoginResponseDto> LoginAsync(string sicil, string password, string ipAddress)
    {
        // Validate inputs
        if (string.IsNullOrWhiteSpace(sicil))
            throw new ArgumentException("Sicil numarası boş olamaz", nameof(sicil));

        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Şifre boş olamaz", nameof(password));

        // Find user by sicil
        var user = await _context.Users
            .Include(u => u.UserBirimRoles)
                .ThenInclude(ubr => ubr.Birim)
            .Include(u => u.UserBirimRoles)
                .ThenInclude(ubr => ubr.Role)
            .FirstOrDefaultAsync(u => u.Sicil == sicil);

        // Check if user exists
        if (user == null)
        {
            _logger.LogWarning("Login attempt with non-existent sicil: {Sicil} from IP: {IpAddress}", sicil, ipAddress);

            // Create audit log for failed attempt
            await CreateAuditLogAsync(null, AuditAction.LoginFailed, "User",
                $"Failed login attempt for sicil: {sicil}", ipAddress);

            throw new UnauthorizedAccessException("Sicil veya şifre hatalı");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            _logger.LogWarning("Login attempt for inactive user: {Sicil} (ID: {UserId}) from IP: {IpAddress}",
                sicil, user.UserID, ipAddress);

            await CreateAuditLogAsync(user.UserID, AuditAction.LoginFailed, "User",
                "Login attempt for inactive account", ipAddress);

            throw new UnauthorizedAccessException("Hesabınız devre dışı bırakılmıştır. Lütfen sistem yöneticisi ile iletişime geçin");
        }

        // Verify password
        if (!_passwordService.VerifyPassword(password, user.SifreHash))
        {
            _logger.LogWarning("Failed login attempt for user: {Sicil} (ID: {UserId}) - Invalid password from IP: {IpAddress}",
                sicil, user.UserID, ipAddress);

            await CreateAuditLogAsync(user.UserID, AuditAction.LoginFailed, "User",
                "Invalid password", ipAddress);

            throw new UnauthorizedAccessException("Sicil veya şifre hatalı");
        }

        // Get active birimler (organizational units)
        var activeBirimRoles = user.UserBirimRoles
            .Where(ubr => ubr.Birim.IsActive)
            .ToList();

        if (!activeBirimRoles.Any())
        {
            _logger.LogWarning("User {Sicil} (ID: {UserId}) has no active birim assignments",
                sicil, user.UserID);

            await CreateAuditLogAsync(user.UserID, AuditAction.LoginFailed, "User",
                "No active birim assignments", ipAddress);

            throw new UnauthorizedAccessException("Hesabınıza atanmış aktif bir birim bulunmamaktadır");
        }

        // Update last login timestamp
        await UpdateLastLoginAsync(user.UserID);

        // Log successful login
        _logger.LogInformation("Successful login for user: {Sicil} (ID: {UserId}) from IP: {IpAddress}",
            sicil, user.UserID, ipAddress);

        await CreateAuditLogAsync(user.UserID, AuditAction.Login, "User",
            "Successful login", ipAddress);

        // Build response
        var response = new LoginResponseDto
        {
            User = MapToUserDto(user),
            Birimler = activeBirimRoles.Select(ubr => new UserBirimRoleDto
            {
                Birim = new BirimDto
                {
                    BirimID = ubr.Birim.BirimID,
                    BirimAdi = ubr.Birim.BirimAdi,
                    Aciklama = ubr.Birim.Aciklama,
                    IsActive = ubr.Birim.IsActive
                },
                Role = new RoleDto
                {
                    RoleID = ubr.Role.RoleID,
                    RoleName = ubr.Role.RoleAdi,
                    Description = ubr.Role.Aciklama
                },
                AssignedAt = ubr.AssignedAt
            }).ToList(),
            RequiresBirimSelection = activeBirimRoles.Count > 1
        };

        // If user has only one birim, auto-select it and generate token
        if (activeBirimRoles.Count == 1)
        {
            var singleBirimRole = activeBirimRoles.First();
            response.SelectedBirim = response.Birimler.First().Birim;
            response.SelectedRole = response.Birimler.First().Role;

            // Note: JWT token will be generated in the controller and set as HttpOnly cookie
        }

        return response;
    }

    /// <summary>
    /// Selects a birim for multi-birim users
    /// Generates new JWT token with selected birim and role
    /// </summary>
    public async Task<LoginResponseDto> SelectBirimAsync(int userId, int birimId)
    {
        // Find user with birim assignments
        var user = await _context.Users
            .Include(u => u.UserBirimRoles)
                .ThenInclude(ubr => ubr.Birim)
            .Include(u => u.UserBirimRoles)
                .ThenInclude(ubr => ubr.Role)
            .FirstOrDefaultAsync(u => u.UserID == userId);

        if (user == null)
            throw new UnauthorizedAccessException("Kullanıcı bulunamadı");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Hesabınız devre dışı bırakılmıştır");

        // Find the selected birim-role assignment
        var selectedBirimRole = user.UserBirimRoles
            .FirstOrDefault(ubr => ubr.BirimID == birimId && ubr.Birim.IsActive);

        if (selectedBirimRole == null)
            throw new UnauthorizedAccessException("Seçilen birime erişim yetkiniz bulunmamaktadır");

        _logger.LogInformation("User {UserId} selected birim: {BirimId} ({BirimName})",
            userId, birimId, selectedBirimRole.Birim.BirimAdi);

        // Build response
        var response = new LoginResponseDto
        {
            User = MapToUserDto(user),
            Birimler = user.UserBirimRoles
                .Where(ubr => ubr.Birim.IsActive)
                .Select(ubr => new UserBirimRoleDto
                {
                    Birim = new BirimDto
                    {
                        BirimID = ubr.Birim.BirimID,
                        BirimAdi = ubr.Birim.BirimAdi,
                        Aciklama = ubr.Birim.Aciklama,
                        IsActive = ubr.Birim.IsActive
                    },
                    Role = new RoleDto
                    {
                        RoleID = ubr.Role.RoleID,
                        RoleName = ubr.Role.RoleAdi,
                        Description = ubr.Role.Aciklama
                    },
                    AssignedAt = ubr.AssignedAt
                }).ToList(),
            SelectedBirim = new BirimDto
            {
                BirimID = selectedBirimRole.Birim.BirimID,
                BirimAdi = selectedBirimRole.Birim.BirimAdi,
                Aciklama = selectedBirimRole.Birim.Aciklama,
                IsActive = selectedBirimRole.Birim.IsActive
            },
            SelectedRole = new RoleDto
            {
                RoleID = selectedBirimRole.Role.RoleID,
                RoleName = selectedBirimRole.Role.RoleAdi,
                Description = selectedBirimRole.Role.Aciklama
            },
            RequiresBirimSelection = false
        };

        return response;
    }

    /// <summary>
    /// Logs out user
    /// </summary>
    public async Task LogoutAsync(int userId, string ipAddress)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user != null)
        {
            _logger.LogInformation("User {UserId} ({Sicil}) logged out from IP: {IpAddress}",
                userId, user.Sicil, ipAddress);

            await CreateAuditLogAsync(userId, AuditAction.Logout, "User",
                "User logged out", ipAddress);
        }

        // Note: JWT token invalidation will be handled by removing the HttpOnly cookie in the controller
        // For additional security, a token blacklist could be implemented here
    }

    /// <summary>
    /// Gets current user information
    /// </summary>
    public async Task<UserDto?> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user != null ? MapToUserDto(user) : null;
    }

    /// <summary>
    /// Updates last login timestamp
    /// </summary>
    public async Task UpdateLastLoginAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.SonGiris = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    // Private helper methods

    /// <summary>
    /// Creates an audit log entry
    /// Reference: ERD.md Section 5.7
    /// </summary>
    private async Task CreateAuditLogAsync(int? userId, AuditAction action, string resource, string details, string ipAddress)
    {
        // Convert details string to JSON object
        var detailsJson = JsonSerializer.Serialize(new { message = details });

        var auditLog = new AuditLog
        {
            UserID = userId,
            Action = action.ToString(), // Convert enum to string
            Resource = resource,
            Details = detailsJson, // Store as JSON
            IPAddress = ipAddress,
            TarihSaat = DateTime.UtcNow
        };

        await _context.AuditLogs.AddAsync(auditLog);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Maps User entity to UserDto
    /// </summary>
    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            UserID = user.UserID,
            AdSoyad = user.AdSoyad,
            Sicil = user.Sicil,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.SonGiris
        };
    }
}
