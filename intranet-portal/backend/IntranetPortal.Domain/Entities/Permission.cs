using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// Permission entity representing atomic permissions in the system
    /// Follows "action.resource" pattern (e.g., create.user, read.announcement)
    /// Maps to "Permission" table in PostgreSQL
    /// </summary>
    [Table("Permission")]
    public class Permission
    {
        /// <summary>
        /// Primary key - Permission ID
        /// </summary>
        [Key]
        [Column("PermissionID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PermissionID { get; set; }

        /// <summary>
        /// Action type (e.g., create, read, update, delete, manage, export, upload)
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("Action")]
        public string Action { get; set; } = string.Empty;

        /// <summary>
        /// Resource type (e.g., user, announcement, auditlog, birim, file, system)
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("Resource")]
        public string Resource { get; set; } = string.Empty;

        /// <summary>
        /// Description of the permission
        /// </summary>
        [Column("Description")]
        public string? Description { get; set; }

        // Navigation properties

        /// <summary>
        /// Roles that have this permission
        /// </summary>
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

        /// <summary>
        /// Helper property to get permission in "action.resource" format
        /// </summary>
        [NotMapped]
        public string FullPermission => $"{Action}.{Resource}";
    }
}
