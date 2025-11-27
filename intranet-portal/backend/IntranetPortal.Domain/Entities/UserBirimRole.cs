using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// UserBirimRole junction entity representing many-to-many relationship
    /// between Users, Birims (units), and Roles.
    /// This is the CRITICAL entity for multi-unit support.
    /// A user can have different roles in different units.
    /// Maps to "UserBirimRole" table in PostgreSQL
    /// </summary>
    [Table("UserBirimRole")]
    public class UserBirimRole
    {
        /// <summary>
        /// Primary key - Junction table ID
        /// </summary>
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        /// <summary>
        /// Foreign key to User
        /// </summary>
        [Required]
        [Column("UserID")]
        public int UserID { get; set; }

        /// <summary>
        /// Foreign key to Birim
        /// </summary>
        [Required]
        [Column("BirimID")]
        public int BirimID { get; set; }

        /// <summary>
        /// Foreign key to Role
        /// </summary>
        [Required]
        [Column("RoleID")]
        public int RoleID { get; set; }

        /// <summary>
        /// Timestamp when this role was assigned to the user in this unit
        /// </summary>
        [Column("AssignedAt")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties

        /// <summary>
        /// Navigation to User entity
        /// </summary>
        [ForeignKey("UserID")]
        public virtual User User { get; set; } = null!;

        /// <summary>
        /// Navigation to Birim entity
        /// </summary>
        [ForeignKey("BirimID")]
        public virtual Birim Birim { get; set; } = null!;

        /// <summary>
        /// Navigation to Role entity
        /// </summary>
        [ForeignKey("RoleID")]
        public virtual Role Role { get; set; } = null!;
    }
}
