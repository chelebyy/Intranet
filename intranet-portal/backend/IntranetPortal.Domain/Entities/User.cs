using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// User entity representing system users
    /// Maps to "User" table in PostgreSQL
    /// </summary>
    [Table("User")]
    public class User
    {
        /// <summary>
        /// Primary key - User ID
        /// </summary>
        [Key]
        [Column("UserID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        /// <summary>
        /// First name of the user
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("Ad")]
        public string Ad { get; set; } = string.Empty;

        /// <summary>
        /// Last name of the user
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("Soyad")]
        public string Soyad { get; set; } = string.Empty;

        /// <summary>
        /// Full name (computed property, not mapped to DB)
        /// </summary>
        [NotMapped]
        public string AdSoyad => $"{Ad} {Soyad}";

        /// <summary>
        /// Personnel number (sicil) - unique identifier used for login
        /// </summary>
        [Required]
        [MaxLength(20)]
        [Column("Sicil")]
        public string Sicil { get; set; } = string.Empty;

        /// <summary>
        /// BCrypt hashed password
        /// </summary>
        [Required]
        [MaxLength(255)]
        [Column("SifreHash")]
        public string SifreHash { get; set; } = string.Empty;

        /// <summary>
        /// Job title/position
        /// </summary>
        [MaxLength(100)]
        [Column("Unvan")]
        public string? Unvan { get; set; }

        /// <summary>
        /// Last login timestamp
        /// </summary>
        [Column("SonGiris")]
        public DateTime? SonGiris { get; set; }

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
        /// User's assignments to units with roles (many-to-many relationship)
        /// </summary>
        public virtual ICollection<UserBirimRole> UserBirimRoles { get; set; } = new List<UserBirimRole>();

        /// <summary>
        /// Audit logs created by this user
        /// </summary>
        public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

        /// <summary>
        /// Files uploaded by this user
        /// </summary>
        public virtual ICollection<UploadedFile> UploadedFiles { get; set; } = new List<UploadedFile>();

        /// <summary>
        /// System settings updated by this user
        /// </summary>
        public virtual ICollection<SystemSettings> SystemSettings { get; set; } = new List<SystemSettings>();
    }
}
