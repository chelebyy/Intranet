using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// RolePermission junction entity representing many-to-many relationship
    /// between Roles and Permissions.
    /// Defines which permissions are granted to which roles.
    /// Maps to "RolePermission" table in PostgreSQL
    /// </summary>
    [Table("RolePermission")]
    public class RolePermission
    {
        /// <summary>
        /// Primary key - Junction table ID
        /// </summary>
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        /// <summary>
        /// Foreign key to Role
        /// </summary>
        [Required]
        [Column("RoleID")]
        public int RoleID { get; set; }

        /// <summary>
        /// Foreign key to Permission
        /// </summary>
        [Required]
        [Column("PermissionID")]
        public int PermissionID { get; set; }

        /// <summary>
        /// Timestamp when this permission was granted to the role
        /// </summary>
        [Column("GrantedAt")]
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties

        /// <summary>
        /// Navigation to Role entity
        /// </summary>
        [ForeignKey("RoleID")]
        public virtual Role Role { get; set; } = null!;

        /// <summary>
        /// Navigation to Permission entity
        /// </summary>
        [ForeignKey("PermissionID")]
        public virtual Permission Permission { get; set; } = null!;
    }
}
