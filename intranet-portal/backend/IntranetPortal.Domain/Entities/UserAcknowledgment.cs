using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    public class UserAcknowledgment
    {
        [Key]
        public int AcknowledgmentID { get; set; }

        public int AnnouncementID { get; set; }

        [ForeignKey("AnnouncementID")]
        public virtual Announcement Announcement { get; set; }

        public int UserID { get; set; }

        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        public DateTime AcknowledgedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string IPAddress { get; set; }
    }
}
