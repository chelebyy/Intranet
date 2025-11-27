using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// Role entity representing system roles (e.g., SistemAdmin, BirimAdmin, etc.)
    /// Maps to "Role" table in PostgreSQL
    /// </summary>
    [Table("Role")]
    public class Role
    {
        /// <summary>
        /// Primary key - Role ID
        /// </summary>
        [Key]
        [Column("RoleID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoleID { get; set; }

        /// <summary>
        /// Role name (unique across system)
        /// Examples: SistemAdmin, BirimAdmin, BirimEditor, BirimGoruntuleyen, SuperAdmin
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("RoleAdi")]
        public string RoleAdi { get; set; } = string.Empty;

        /// <summary>
        /// Description of the role
        /// </summary>
        [Column("Aciklama")]
        public string? Aciklama { get; set; }

        /// <summary>
        /// Record creation timestamp
        /// </summary>
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties

        /// <summary>
        /// User assignments with this role in different units
        /// </summary>
        public virtual ICollection<UserBirimRole> UserBirimRoles { get; set; } = new List<UserBirimRole>();

        /// <summary>
        /// Permissions assigned to this role
        /// </summary>
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
