namespace IntranetPortal.Application.DTOs;

/// <summary>
/// User-Birim-Role association DTO
/// Used to represent a user's role in a specific organizational unit
/// </summary>
public class UserBirimRoleDto
{
    public BirimDto Birim { get; set; } = null!;
    public RoleDto Role { get; set; } = null!;
    public DateTime AssignedAt { get; set; }
}
