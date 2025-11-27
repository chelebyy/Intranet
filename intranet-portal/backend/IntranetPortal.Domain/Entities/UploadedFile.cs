using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// UploadedFile entity for file upload management
    /// Supports polymorphic relationships with different entity types
    /// Implements PRD requirements FR-33 to FR-38
    /// Maps to "UploadedFile" table in PostgreSQL
    /// </summary>
    [Table("UploadedFile")]
    public class UploadedFile
    {
        /// <summary>
        /// Primary key - File ID (UUID for security and uniqueness)
        /// </summary>
        [Key]
        [Column("FileID")]
        public Guid FileID { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Stored file name (sanitized, unique)
        /// </summary>
        [Required]
        [MaxLength(255)]
        [Column("FileName")]
        public string FileName { get; set; } = string.Empty;

        /// <summary>
        /// Original file name as uploaded by user
        /// </summary>
        [Required]
        [MaxLength(255)]
        [Column("OriginalFileName")]
        public string OriginalFileName { get; set; } = string.Empty;

        /// <summary>
        /// Full file path on server
        /// </summary>
        [Required]
        [MaxLength(500)]
        [Column("FilePath")]
        public string FilePath { get; set; } = string.Empty;

        /// <summary>
        /// File size in bytes
        /// </summary>
        [Required]
        [Column("FileSize")]
        public long FileSize { get; set; }

        /// <summary>
        /// MIME type (e.g., application/pdf, image/jpeg)
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("MimeType")]
        public string MimeType { get; set; } = string.Empty;

        /// <summary>
        /// File extension (e.g., .pdf, .jpg)
        /// </summary>
        [Required]
        [MaxLength(10)]
        [Column("FileExtension")]
        public string FileExtension { get; set; } = string.Empty;

        /// <summary>
        /// SHA-256 hash for duplicate detection and integrity verification
        /// </summary>
        [Required]
        [MaxLength(64)]
        [Column("FileHash")]
        public string FileHash { get; set; } = string.Empty;

        // Polymorphic relationship fields

        /// <summary>
        /// Entity type that this file belongs to (e.g., "IzinTalep", "ArizaKayit")
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("EntityType")]
        public string EntityType { get; set; } = string.Empty;

        /// <summary>
        /// ID of the entity that this file belongs to
        /// </summary>
        [Required]
        [Column("EntityID")]
        public int EntityID { get; set; }

        // User and Birim relationships

        /// <summary>
        /// Foreign key to User who uploaded the file
        /// </summary>
        [Required]
        [Column("UploadedByUserID")]
        public int UploadedByUserID { get; set; }

        /// <summary>
        /// Foreign key to Birim where file was uploaded
        /// </summary>
        [Required]
        [Column("BirimID")]
        public int BirimID { get; set; }

        // Timestamps

        /// <summary>
        /// Upload timestamp
        /// </summary>
        [Column("UploadedAt")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Soft delete flag
        /// </summary>
        [Column("IsDeleted")]
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Deletion timestamp (nullable)
        /// </summary>
        [Column("DeletedAt")]
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Optional description
        /// </summary>
        [Column("Description")]
        public string? Description { get; set; }

        // Navigation properties

        /// <summary>
        /// Navigation to User entity
        /// </summary>
        [ForeignKey("UploadedByUserID")]
        public virtual User UploadedByUser { get; set; } = null!;

        /// <summary>
        /// Navigation to Birim entity
        /// </summary>
        [ForeignKey("BirimID")]
        public virtual Birim Birim { get; set; } = null!;
    }
}
