using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Announcements
{
    public class CreateAnnouncementDto
    {
        [Required(ErrorMessage = "Başlık gereklidir")]
        [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir")]
        public string Title { get; set; }

        [Required(ErrorMessage = "İçerik gereklidir")]
        public string Content { get; set; }

        [Required(ErrorMessage = "Tip gereklidir (Info/Warning/Critical)")]
        public string Type { get; set; }

        [Required(ErrorMessage = "Gösterim tipi gereklidir (Banner/Modal/Widget)")]
        public string DisplayType { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Priority { get; set; }

        // Targets: List of { Type: "Role", Value: 1 } etc.
        public List<CreateAnnouncementTargetDto> Targets { get; set; } = new();
    }

    public class CreateAnnouncementTargetDto
    {
        [Required]
        public string TargetType { get; set; } // Role, Unit, User, All
        public int? TargetValue { get; set; }
    }
}
