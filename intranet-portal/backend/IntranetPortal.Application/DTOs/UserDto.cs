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
}
