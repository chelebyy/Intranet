using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Birims;

public class CreateBirimDto
{
    [Required(ErrorMessage = "Unit Name is required")]
    [MaxLength(100, ErrorMessage = "Unit Name cannot exceed 100 characters")]
    public string BirimAdi { get; set; } = string.Empty;

    public string? Aciklama { get; set; }

    public bool IsActive { get; set; } = true;
}
