namespace IntranetPortal.Application.DTOs.Permissions;

public class PermissionDto
{
    public int PermissionID { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Resource { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Helper property for frontend
    public string FullPermission => $"{Action}.{Resource}";
}
