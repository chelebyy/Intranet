namespace IntranetPortal.Application.DTOs;

/// <summary>
/// Role DTO
/// </summary>
public class RoleDto
{
    public int RoleID { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Description { get; set; }
}
