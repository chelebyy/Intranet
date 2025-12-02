using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs;

public class IPRestrictionDto
{
    public int ID { get; set; }
    public string IPAddress { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "Whitelist";
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedBy { get; set; }
}

public class CreateIPRestrictionDto
{
    [Required]
    [MaxLength(45)]
    public string IPAddress { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [Required]
    public string Type { get; set; } = "Whitelist"; // Whitelist or Blacklist
}

public class UpdateIPRestrictionDto
{
    [MaxLength(255)]
    public string? Description { get; set; }

    public bool? IsActive { get; set; }
}
