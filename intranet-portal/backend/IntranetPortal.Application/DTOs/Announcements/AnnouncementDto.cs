using System;
using System.Collections.Generic;

namespace IntranetPortal.Application.DTOs.Announcements
{
    public class AnnouncementDto
    {
        public int AnnouncementID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Type { get; set; }
        public string DisplayType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedByName { get; set; }
        
        public List<AnnouncementTargetDto> Targets { get; set; }
        public bool IsRead { get; set; } // For user-specific queries
    }

    public class AnnouncementTargetDto
    {
        public int TargetID { get; set; }
        public string TargetType { get; set; }
        public int? TargetValue { get; set; }
        public string? TargetName { get; set; } // "IT Department", "Admin Role" etc. - populated manually
    }
}
