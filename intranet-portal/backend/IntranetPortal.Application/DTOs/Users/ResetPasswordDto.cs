using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Users
{
    public class ResetPasswordDto
    {
        [Required]
        [MinLength(12)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
