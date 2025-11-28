using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Permissions;

public class AssignPermissionsDto
{
    [Required]
    public List<int> PermissionIds { get; set; } = new();
}
