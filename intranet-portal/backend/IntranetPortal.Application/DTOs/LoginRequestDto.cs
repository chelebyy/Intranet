using System.ComponentModel.DataAnnotations;

namespace IntranetPortal.Application.DTOs;

/// <summary>
/// Login request DTO
/// Reference: API_SPECIFICATION.md Section 2.1
/// </summary>
public class LoginRequestDto
{
    /// <summary>
    /// User sicil (personnel number)
    /// </summary>
    [Required(ErrorMessage = "Sicil numarası gereklidir")]
    [MaxLength(20, ErrorMessage = "Sicil numarası en fazla 20 karakter olabilir")]
    public string Sicil { get; set; } = string.Empty;

    /// <summary>
    /// User password
    /// </summary>
    [Required(ErrorMessage = "Şifre gereklidir")]
    public string Password { get; set; } = string.Empty;
}
