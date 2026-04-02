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

    public async Task<AuditLogDto?> GetByIdAsync(long logId, int? birimId = null)
    {
        var query = _context.AuditLogs
            .Include(a => a.User)
            .Include(a => a.Birim)
            .Where(a => a.LogID == logId);

        if (birimId.HasValue)
        {
            query = query.Where(a => a.BirimID == birimId.Value);
        }

        var log = await query.FirstOrDefaultAsync();

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

    public async Task<List<string>> GetDistinctActionsAsync(int? birimId = null)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (birimId.HasValue)
        {
            query = query.Where(a => a.BirimID == birimId.Value);
        }

        return await query
            .Select(a => a.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
    }

    public async Task CreateLogAsync(int? userId, int? birimId, string action, string? resource, string? details, string? ipAddress)
    {
        // Details'i JSON formatına dönüştür
        string? detailsJson = null;
        if (!string.IsNullOrEmpty(details))
        {
            detailsJson = System.Text.Json.JsonSerializer.Serialize(new { message = details });
        }
        
        var auditLog = new IntranetPortal.Domain.Entities.AuditLog
        {
            UserID = userId,
            BirimID = birimId,
            Action = action,
            Resource = resource,
            Details = detailsJson,
            IPAddress = ipAddress,
            TarihSaat = DateTime.UtcNow
        };

        await _context.AuditLogs.AddAsync(auditLog);
        await _context.SaveChangesAsync();
    }
}
