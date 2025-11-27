using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// Birim (Unit/Department) entity representing organizational units
    /// Maps to "Birim" table in PostgreSQL
    /// </summary>
    [Table("Birim")]
    public class Birim
    {
        /// <summary>
        /// Primary key - Birim ID
        /// </summary>
        [Key]
        [Column("BirimID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BirimID { get; set; }

        /// <summary>
        /// Birim name (unique across system)
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("BirimAdi")]
        public string BirimAdi { get; set; } = string.Empty;

        /// <summary>
        /// Description of the unit
        /// </summary>
        [Column("Aciklama")]
        public string? Aciklama { get; set; }

        /// <summary>
        /// Active status (soft delete support)
        /// </summary>
        [Column("IsActive")]
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Record creation timestamp
        /// </summary>
        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Record last update timestamp
        /// </summary>
        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties

        /// <summary>
        /// User assignments to this unit with roles
        /// </summary>
        public virtual ICollection<UserBirimRole> UserBirimRoles { get; set; } = new List<UserBirimRole>();

        /// <summary>
        /// Audit logs related to this unit
        /// </summary>
        public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

        /// <summary>
        /// Files uploaded for this unit
        /// </summary>
        public virtual ICollection<UploadedFile> UploadedFiles { get; set; } = new List<UploadedFile>();
    }
}
