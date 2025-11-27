using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// AuditLog entity for comprehensive audit logging
    /// Records all critical operations in the system
    /// Maps to "AuditLog" table in PostgreSQL
    /// </summary>
    [Table("AuditLog")]
    public class AuditLog
    {
        /// <summary>
        /// Primary key - Log ID (BIGSERIAL for large log volume)
        /// </summary>
        [Key]
        [Column("LogID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long LogID { get; set; }

        /// <summary>
        /// Foreign key to User (nullable - can be NULL for system actions)
        /// </summary>
        [Column("UserID")]
        public int? UserID { get; set; }

        /// <summary>
        /// Foreign key to Birim (nullable - can be NULL for system-wide actions)
        /// </summary>
        [Column("BirimID")]
        public int? BirimID { get; set; }

        /// <summary>
        /// Action performed (e.g., Login, CreateUser, UpdateContent, DeleteAnnouncement)
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("Action")]
        public string Action { get; set; } = string.Empty;

        /// <summary>
        /// Resource type affected (e.g., User, Announcement, Role)
        /// </summary>
        [MaxLength(100)]
        [Column("Resource")]
        public string? Resource { get; set; }

        /// <summary>
        /// Additional details in JSON format (stored as JSONB in PostgreSQL)
        /// </summary>
        [Column("Details", TypeName = "jsonb")]
        public string? Details { get; set; }

        /// <summary>
        /// IP address of the request (supports both IPv4 and IPv6)
        /// </summary>
        [MaxLength(45)]
        [Column("IPAddress")]
        public string? IPAddress { get; set; }

        /// <summary>
        /// Timestamp of the action
        /// </summary>
        [Column("TarihSaat")]
        public DateTime TarihSaat { get; set; } = DateTime.UtcNow;

        // Navigation properties

        /// <summary>
        /// Navigation to User entity (nullable)
        /// </summary>
        [ForeignKey("UserID")]
        public virtual User? User { get; set; }

        /// <summary>
        /// Navigation to Birim entity (nullable)
        /// </summary>
        [ForeignKey("BirimID")]
        public virtual Birim? Birim { get; set; }

        // Helper methods

        /// <summary>
        /// Set details from an object (serializes to JSON)
        /// </summary>
        public void SetDetailsFromObject(object obj)
        {
            Details = JsonSerializer.Serialize(obj, new JsonSerializerOptions
            {
                WriteIndented = false,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }

        /// <summary>
        /// Get details as typed object
        /// </summary>
        public T? GetDetailsAsObject<T>()
        {
            if (string.IsNullOrEmpty(Details))
                return default;

            return JsonSerializer.Deserialize<T>(Details, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }
    }
}
