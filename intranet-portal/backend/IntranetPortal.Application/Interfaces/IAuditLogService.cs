using IntranetPortal.Application.DTOs;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Service interface for Audit Log operations
/// </summary>
public interface IAuditLogService
{
    Task<AuditLogPagedResponse> GetLogsAsync(AuditLogFilterDto filter);
    Task<AuditLogDto?> GetByIdAsync(long logId);
    Task<List<string>> GetDistinctActionsAsync();
}
