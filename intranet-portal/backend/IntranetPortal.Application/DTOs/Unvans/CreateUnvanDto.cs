using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs.Unvans;

public class CreateUnvanDto
{
    [Required(ErrorMessage = "Ünvan adı zorunludur")]
    [MaxLength(100, ErrorMessage = "Ünvan adı en fazla 100 karakter olabilir")]
    public string UnvanAdi { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir")]
    public string? Aciklama { get; set; }

    public bool IsActive { get; set; } = true;
}
