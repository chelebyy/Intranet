using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Service for Audit Log operations
/// </summary>
public class AuditLogService : IAuditLogService
{
    private readonly IIntranetDbContext _context;

    public AuditLogService(IIntranetDbContext context)
    {
        _context = context;
    }

    public async Task<AuditLogPagedResponse> GetLogsAsync(AuditLogFilterDto filter)
    {
        var query = _context.AuditLogs
            .Include(a => a.User)
            .Include(a => a.Birim)
            .AsQueryable();

        // Apply filters
        if (filter.UserID.HasValue)
            query = query.Where(a => a.UserID == filter.UserID.Value);

        if (filter.BirimID.HasValue)
            query = query.Where(a => a.BirimID == filter.BirimID.Value);

        if (!string.IsNullOrEmpty(filter.Action))
            query = query.Where(a => a.Action == filter.Action);

        if (filter.StartDate.HasValue)
            query = query.Where(a => a.TarihSaat >= filter.StartDate.Value);

        if (filter.EndDate.HasValue)
            query = query.Where(a => a.TarihSaat <= filter.EndDate.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            var searchLower = filter.SearchTerm.ToLower();
            query = query.Where(a => 
                (a.User != null && (a.User.Ad.ToLower().Contains(searchLower) || a.User.Soyad.ToLower().Contains(searchLower))) ||
                (a.Action.ToLower().Contains(searchLower)) ||
                (a.Resource != null && a.Resource.ToLower().Contains(searchLower)) ||
                (a.IPAddress != null && a.IPAddress.Contains(searchLower))
            );
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply ordering and pagination
        var items = await query
            .OrderByDescending(a => a.TarihSaat)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(a => new AuditLogDto
            {
                LogID = a.LogID,
                UserID = a.UserID,
                UserName = a.User != null ? $"{a.User.Ad} {a.User.Soyad}" : null,
                BirimID = a.BirimID,
                BirimName = a.Birim != null ? a.Birim.BirimAdi : null,
                Action = a.Action,
                Resource = a.Resource,
                Details = a.Details,
                IPAddress = a.IPAddress,
                TarihSaat = a.TarihSaat
            })
            .ToListAsync();

        return new AuditLogPagedResponse
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<AuditLogDto?> GetByIdAsync(long logId)
    {
        var log = await _context.AuditLogs
            .Include(a => a.User)
            .Include(a => a.Birim)
            .FirstOrDefaultAsync(a => a.LogID == logId);

        if (log == null) return null;

        return new AuditLogDto
        {
            LogID = log.LogID,
            UserID = log.UserID,
            UserName = log.User != null ? $"{log.User.Ad} {log.User.Soyad}" : null,
            BirimID = log.BirimID,
            BirimName = log.Birim?.BirimAdi,
            Action = log.Action,
            Resource = log.Resource,
            Details = log.Details,
            IPAddress = log.IPAddress,
            TarihSaat = log.TarihSaat
        };
    }

    public async Task<List<string>> GetDistinctActionsAsync()
    {
        return await _context.AuditLogs
            .Select(a => a.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
    }
}
