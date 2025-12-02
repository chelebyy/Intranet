namespace IntranetPortal.Application.DTOs;

/// <summary>
/// User DTO for API responses
/// Excludes sensitive data like password hash
/// </summary>
public class UserDto
{
    public int UserID { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Soyad { get; set; } = string.Empty;
    public string AdSoyad => $"{Ad} {Soyad}";
    public string Sicil { get; set; } = string.Empty;
    public string? Unvan { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    /// <summary>
    /// User's assigned birims with roles
    /// </summary>
    public List<UserBirimRoleInfoDto> BirimRoles { get; set; } = new();
}

/// <summary>
/// DTO for user's birim-role assignments (simplified)
/// </summary>
public class UserBirimRoleInfoDto
{
    public int BirimID { get; set; }
    public string BirimAdi { get; set; } = string.Empty;
    public int RoleID { get; set; }
    public string RoleName { get; set; } = string.Empty;
}
