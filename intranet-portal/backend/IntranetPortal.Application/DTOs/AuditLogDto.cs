namespace IntranetPortal.Application.DTOs;

/// <summary>
/// Audit Log DTO for API responses
/// </summary>
public class AuditLogDto
{
    public long LogID { get; set; }
    public int? UserID { get; set; }
    public string? UserName { get; set; }
    public int? BirimID { get; set; }
    public string? BirimName { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Resource { get; set; }
    public string? Details { get; set; }
    public string? IPAddress { get; set; }
    public DateTime TarihSaat { get; set; }
}

/// <summary>
/// Audit Log filter parameters
/// </summary>
public class AuditLogFilterDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public int? UserID { get; set; }
    public int? BirimID { get; set; }
    public string? Action { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SearchTerm { get; set; }
}

/// <summary>
/// Paginated audit log response
/// </summary>
public class AuditLogPagedResponse
{
    public List<AuditLogDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
