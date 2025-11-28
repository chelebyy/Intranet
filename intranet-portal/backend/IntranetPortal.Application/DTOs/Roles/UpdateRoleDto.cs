using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Roles;

public class UpdateRoleDto
{
    [Required(ErrorMessage = "Role Name is required")]
    [MaxLength(50, ErrorMessage = "Role Name cannot exceed 50 characters")]
    public string RoleAdi { get; set; } = string.Empty;

    public string? Aciklama { get; set; }
}
