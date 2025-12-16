using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    public class Announcement
    {
        [Key]
        public int AnnouncementID { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; } // HTML Content

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } // Info, Warning, Critical

        [Required]
        [MaxLength(50)]
        public string DisplayType { get; set; } // Banner, Modal, Widget

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public virtual User CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public int Priority { get; set; } = 0; // Higher number = Higher priority

        // Navigation Properties
        public virtual ICollection<AnnouncementTarget> Targets { get; set; }
        public virtual ICollection<UserAcknowledgment> Acknowledgments { get; set; }
    }
}
