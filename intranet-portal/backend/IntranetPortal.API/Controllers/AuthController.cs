using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

/// <summary>
/// Authentication controller
/// Reference: API_SPECIFICATION.md Section 2
/// Handles login, logout, birim selection, and current user info
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthenticationService authService,
        IJwtTokenService jwtTokenService,
        IUserService userService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _jwtTokenService = jwtTokenService;
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// User login endpoint
    /// POST /api/auth/login
    /// Reference: API_SPECIFICATION.md Section 2.1
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            // Get client IP address
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            // Authenticate user
            var loginResponse = await _authService.LoginAsync(request.Sicil, request.Password, ipAddress);

            // Create user entity for token generation
            var user = new User
            {
                UserID = loginResponse.User.UserID,
                Ad = loginResponse.User.Ad,
                Soyad = loginResponse.User.Soyad,
                Sicil = loginResponse.User.Sicil
            };

            // If user has only one birim, generate full JWT token immediately
            if (!loginResponse.RequiresBirimSelection && loginResponse.SelectedBirim != null && loginResponse.SelectedRole != null)
            {
                var birim = new Birim
                {
                    BirimID = loginResponse.SelectedBirim.BirimID,
                    BirimAdi = loginResponse.SelectedBirim.BirimAdi
                };

                var role = new Role
                {
                    RoleID = loginResponse.SelectedRole.RoleID,
                    RoleAdi = loginResponse.SelectedRole.RoleName
                };

                // Generate JWT token with birim and role
                var token = _jwtTokenService.GenerateToken(user, birim, role);

                // Set HttpOnly cookie (SECURITY_ANALYSIS_REPORT.md Finding #2)
                SetAuthCookie(token);
            }
            else if (loginResponse.RequiresBirimSelection && loginResponse.Birimler.Count > 0)
            {
                // User has multiple birims - generate temporary token with first birim
                // This allows the user to call select-birim endpoint
                var firstBirim = loginResponse.Birimler.First();
                var tempBirim = new Birim
                {
                    BirimID = firstBirim.Birim.BirimID,
                    BirimAdi = firstBirim.Birim.BirimAdi
                };

                var tempRole = new Role
                {
                    RoleID = firstBirim.Role.RoleID,
                    RoleAdi = firstBirim.Role.RoleName
                };

                // Generate temporary JWT token (will be replaced when user selects birim)
                var tempToken = _jwtTokenService.GenerateToken(user, tempBirim, tempRole);
                SetAuthCookie(tempToken);
            }

            var message = loginResponse.RequiresBirimSelection
                ? "Lütfen bir birim seçiniz"
                : "Giriş başarılı";

            return Ok(ApiResponse<LoginResponseDto>.Ok(loginResponse, message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<LoginResponseDto>.Fail(ex.Message, "UNAUTHORIZED"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for sicil: {Sicil}", request.Sicil);
            return StatusCode(500, ApiResponse<LoginResponseDto>.Fail("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.", "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Select birim for multi-birim users
    /// POST /api/auth/select-birim
    /// Reference: TECHNICAL_DESIGN.md Section 2.1 - Multi-Unit Support
    /// </summary>
    [HttpPost("select-birim")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> SelectBirim([FromBody] SelectBirimRequestDto request)
    {
        try
        {
            // Get userId from current claims
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.Fail("Geçersiz oturum. Lütfen tekrar giriş yapınız.", "INVALID_TOKEN"));
            }

            // Select birim
            var response = await _authService.SelectBirimAsync(userId, request.BirimId);

            // Generate new JWT token with selected birim
            if (response.SelectedBirim != null && response.SelectedRole != null)
            {
                var user = new User
                {
                    UserID = response.User.UserID,
                    Ad = response.User.Ad,
                    Soyad = response.User.Soyad,
                    Sicil = response.User.Sicil
                };

                var birim = new Birim
                {
                    BirimID = response.SelectedBirim.BirimID,
                    BirimAdi = response.SelectedBirim.BirimAdi
                };

                var role = new Role
                {
                    RoleID = response.SelectedRole.RoleID,
                    RoleAdi = response.SelectedRole.RoleName
                };

                // Generate new JWT token
                var token = _jwtTokenService.GenerateToken(user, birim, role);

                // Update HttpOnly cookie
                SetAuthCookie(token);
            }

            return Ok(ApiResponse<LoginResponseDto>.Ok(response, "Birim seçimi başarılı"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<LoginResponseDto>.Fail(ex.Message, "UNAUTHORIZED"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Select birim error for user: {UserId}", User.FindFirst("userId")?.Value);
            return StatusCode(500, ApiResponse<LoginResponseDto>.Fail("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.", "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Logout endpoint
    /// POST /api/auth/logout
    /// Reference: API_SPECIFICATION.md Section 2.2
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Logout()
    {
        try
        {
            // Get userId from current claims
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var userId))
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
                await _authService.LogoutAsync(userId, ipAddress);
            }

            // Remove HttpOnly cookie
            Response.Cookies.Delete("auth_token");

            return Ok(ApiResponse<bool>.Ok(true, "Çıkış başarılı"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Logout error");
            return StatusCode(500, ApiResponse<bool>.Fail("Bir hata oluştu.", "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Get current authenticated user
    /// GET /api/auth/me
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> GetCurrentUser()
    {
        try
        {
            // Get userId from current claims
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<object>.Fail("Geçersiz oturum", "INVALID_TOKEN"));
            }

            var user = await _authService.GetCurrentUserAsync(userId);
            if (user == null)
            {
                return NotFound(ApiResponse<object>.Fail("Kullanıcı bulunamadı", "USER_NOT_FOUND"));
            }

            // Get birim and role info from claims
            var birimId = User.FindFirst("birimId")?.Value;
            var birimAdi = User.FindFirst("birimAdi")?.Value;
            var roleId = User.FindFirst("roleId")?.Value;
            var roleName = User.FindFirst("roleName")?.Value;

            var userData = new
            {
                user,
                currentBirim = new
                {
                    birimId = int.TryParse(birimId, out var bId) ? bId : (int?)null,
                    birimAdi
                },
                currentRole = new
                {
                    roleId = int.TryParse(roleId, out var rId) ? rId : (int?)null,
                    roleName
                }
            };

            return Ok(ApiResponse<object>.Ok(userData));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get current user error");
            return StatusCode(500, ApiResponse<object>.Fail("Bir hata oluştu", "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Change current user password
    /// POST /api/auth/change-password
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<bool>.Fail("Validasyon hatası", "VALIDATION_ERROR"));
            }

            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<bool>.Fail("Geçersiz oturum", "INVALID_TOKEN"));
            }

            var result = await _userService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            if (!result.Success)
            {
                return BadRequest(ApiResponse<bool>.Fail(result.Message, "PASSWORD_ERROR"));
            }

            return Ok(ApiResponse<bool>.Ok(true, "Şifre değiştirildi"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Change password error");
            return StatusCode(500, ApiResponse<bool>.Fail("Bir hata oluştu", "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Sets JWT token as HttpOnly cookie
    /// Reference: SECURITY_ANALYSIS_REPORT.md Finding #2
    /// </summary>
    private void SetAuthCookie(string token)
    {
        // Determine if we're in development (HTTP) or production (HTTPS)
        var isHttps = Request.IsHttps;

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, // Prevents JavaScript access (XSS protection)
            Secure = isHttps, // HTTPS only in production, HTTP allowed in development
            SameSite = isHttps ? SameSiteMode.Strict : SameSiteMode.Lax, // Lax for development cross-origin
            Expires = DateTimeOffset.UtcNow.AddHours(8), // Match JWT expiry
            Path = "/"
        };

        Response.Cookies.Append("auth_token", token, cookieOptions);
    }
}
