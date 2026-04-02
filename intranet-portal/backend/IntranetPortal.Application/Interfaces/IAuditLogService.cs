using IntranetPortal.Application.DTOs;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Service interface for Audit Log operations
/// </summary>
public interface IAuditLogService
{
    Task<AuditLogPagedResponse> GetLogsAsync(AuditLogFilterDto filter);
    Task<AuditLogDto?> GetByIdAsync(long logId, int? birimId = null);
    Task<List<string>> GetDistinctActionsAsync(int? birimId = null);
    Task CreateLogAsync(int? userId, int? birimId, string action, string? resource, string? details, string? ipAddress);
}
