using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    /// <summary>
    /// Unvan (Title/Position) entity representing job titles
    /// Maps to "Unvan" table in PostgreSQL
    /// </summary>
    [Table("Unvan")]
    public class Unvan
    {
        /// <summary>
        /// Primary key - Unvan ID
        /// </summary>
        [Key]
        [Column("UnvanID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UnvanID { get; set; }

        /// <summary>
        /// Unvan name (unique across system)
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("UnvanAdi")]
        public string UnvanAdi { get; set; } = string.Empty;

        /// <summary>
        /// Description of the title
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
        /// Users with this title
        /// </summary>
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
