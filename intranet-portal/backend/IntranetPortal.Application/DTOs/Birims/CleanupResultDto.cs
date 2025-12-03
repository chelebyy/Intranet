namespace IntranetPortal.Application.DTOs.Birims;

/// <summary>
/// Birim temizlik işlemi sonucu
/// </summary>
public class CleanupResultDto
{
    public int DeletedCount { get; set; }
    public List<string> DeletedBirims { get; set; } = new();
    public List<string> KeptBirims { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}
