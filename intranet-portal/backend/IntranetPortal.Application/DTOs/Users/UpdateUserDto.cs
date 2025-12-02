using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        [Required]
        [MaxLength(50)]
        public string Ad { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Soyad { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Sicil { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Unvan { get; set; }

        public bool IsActive { get; set; }
    }
}
