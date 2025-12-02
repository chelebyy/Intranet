using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities;

/// <summary>
/// IP Restriction entity for managing allowed/blocked IPs
/// </summary>
[Table("IPRestrictions")]
public class IPRestriction
{
    [Key]
    [Column("ID")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }

    /// <summary>
    /// IP address or CIDR range (e.g., 192.168.1.1 or 192.168.1.0/24)
    /// </summary>
    [Required]
    [MaxLength(45)]
    [Column("IPAddress")]
    public string IPAddress { get; set; } = string.Empty;

    /// <summary>
    /// Description for this IP rule
    /// </summary>
    [MaxLength(255)]
    [Column("Description")]
    public string? Description { get; set; }

    /// <summary>
    /// Type: Whitelist or Blacklist
    /// </summary>
    [Required]
    [MaxLength(20)]
    [Column("Type")]
    public string Type { get; set; } = "Whitelist"; // Whitelist or Blacklist

    /// <summary>
    /// Is this rule active?
    /// </summary>
    [Column("IsActive")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Created date
    /// </summary>
    [Column("CreatedAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Created by user ID
    /// </summary>
    [Column("CreatedBy")]
    public int? CreatedBy { get; set; }
}
