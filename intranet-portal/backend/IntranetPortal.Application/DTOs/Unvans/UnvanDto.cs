namespace IntranetPortal.Application.DTOs.Unvans;

public class UnvanDto
{
    public int UnvanID { get; set; }
    public string UnvanAdi { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public bool IsActive { get; set; }
}
