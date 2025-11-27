namespace IntranetPortal.Application.DTOs;

/// <summary>
/// Login response DTO
/// Reference: API_SPECIFICATION.md Section 2.1
/// Note: JWT token is sent via HttpOnly Cookie, NOT in response body
/// </summary>
public class LoginResponseDto
{
    /// <summary>
    /// Authenticated user information
    /// </summary>
    public UserDto User { get; set; } = null!;

    /// <summary>
    /// List of organizational units (birimler) the user belongs to
    /// If count > 1, frontend should show unit selection screen
    /// </summary>
    public List<UserBirimRoleDto> Birimler { get; set; } = new();

    /// <summary>
    /// Currently selected birim (null if user needs to select)
    /// </summary>
    public BirimDto? SelectedBirim { get; set; }

    /// <summary>
    /// Currently active role (null if user needs to select birim first)
    /// </summary>
    public RoleDto? SelectedRole { get; set; }

    /// <summary>
    /// Indicates whether user needs to select a birim
    /// True if user belongs to multiple birims
    /// </summary>
    public bool RequiresBirimSelection { get; set; }
}
