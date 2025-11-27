namespace IntranetPortal.Application.DTOs;

/// <summary>
/// Birim (Organizational Unit) DTO
/// Used in login response to show available units for multi-unit users
/// </summary>
public class BirimDto
{
    public int BirimID { get; set; }
    public string BirimAdi { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public bool IsActive { get; set; }
}
