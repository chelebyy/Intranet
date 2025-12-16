using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntranetPortal.Domain.Entities
{
    public class AnnouncementTarget
    {
        [Key]
        public int TargetID { get; set; }

        public int AnnouncementID { get; set; }

        [ForeignKey("AnnouncementID")]
        public virtual Announcement Announcement { get; set; }

        [Required]
        [MaxLength(50)]
        public string TargetType { get; set; } // "All", "Role", "Unit", "User"

        public int? TargetValue { get; set; } // RoleID, BirimID, or UserID (Null for "All")
    }
}
