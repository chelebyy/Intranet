using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// SystemSettings entity for dynamic system configuration
    /// Implements PRD requirements FR-44 to FR-47 (maintenance mode, file upload settings, etc.)
    /// Maps to "SystemSettings" table in PostgreSQL
    /// </summary>
    [Table("SystemSettings")]
    public class SystemSettings
    {
        /// <summary>
        /// Primary key - Setting ID
        /// </summary>
        [Key]
        [Column("SettingID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SettingID { get; set; }

        /// <summary>
        /// Setting key (unique, e.g., "MaintenanceMode.IsEnabled", "FileUpload.MaxSizeMB")
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("SettingKey")]
        public string SettingKey { get; set; } = string.Empty;

        /// <summary>
        /// Setting value (stored as text, can be parsed as needed)
        /// </summary>
        [Required]
        [Column("SettingValue")]
        public string SettingValue { get; set; } = string.Empty;

        /// <summary>
        /// Description of the setting
        /// </summary>
        [Column("Description")]
        public string? Description { get; set; }

        /// <summary>
        /// Last update timestamp
        /// </summary>
        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Foreign key to User who last updated this setting (nullable)
        /// </summary>
        [Column("UpdatedByUserID")]
        public int? UpdatedByUserID { get; set; }

        // Navigation properties

        /// <summary>
        /// Navigation to User entity (nullable)
        /// </summary>
        [ForeignKey("UpdatedByUserID")]
        public virtual User? UpdatedByUser { get; set; }

        // Helper methods

        /// <summary>
        /// Get setting value as boolean
        /// </summary>
        public bool GetBoolValue()
        {
            return bool.TryParse(SettingValue, out var result) && result;
        }

        /// <summary>
        /// Get setting value as integer
        /// </summary>
        public int GetIntValue()
        {
            return int.TryParse(SettingValue, out var result) ? result : 0;
        }

        /// <summary>
        /// Get setting value as double
        /// </summary>
        public double GetDoubleValue()
        {
            return double.TryParse(SettingValue, out var result) ? result : 0.0;
        }
    }
}
