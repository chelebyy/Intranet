using IntranetPortal.API.Attributes;
using IntranetPortal.API.Extensions;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

/// <summary>
/// Controller for Audit Log operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Get paginated audit logs with filters
    /// </summary>
    [HttpGet]
    [HasPermission(Permissions.ReadAuditLog)]
    public async Task<IActionResult> GetLogs([FromQuery] AuditLogFilterDto filter)
    {
        if (!IsStrictSuperAdmin())
        {
            var activeBirimId = User.GetBirimId();
            if (!activeBirimId.HasValue)
            {
                return StatusCode(403, new { success = false, message = "Aktif birim seçimi gereklidir" });
            }

            filter.BirimID = activeBirimId.Value;
        }

        var result = await _auditLogService.GetLogsAsync(filter);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// Get single audit log by ID
    /// </summary>
    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadAuditLog)]
    public async Task<IActionResult> GetById(long id)
    {
        var scopedBirimId = IsStrictSuperAdmin() ? null : User.GetBirimId();
        if (!IsStrictSuperAdmin() && !scopedBirimId.HasValue)
        {
            return StatusCode(403, new { success = false, message = "Aktif birim seçimi gereklidir" });
        }

        var log = await _auditLogService.GetByIdAsync(id, scopedBirimId);
        if (log == null)
            return NotFound(new { success = false, message = "Log bulunamadı" });

        return Ok(new { success = true, data = log });
    }

    /// <summary>
    /// Get distinct action types for filter dropdown
    /// </summary>
    [HttpGet("actions")]
    [HasPermission(Permissions.ReadAuditLog)]
    public async Task<IActionResult> GetActions()
    {
        var scopedBirimId = IsStrictSuperAdmin() ? null : User.GetBirimId();
        if (!IsStrictSuperAdmin() && !scopedBirimId.HasValue)
        {
            return StatusCode(403, new { success = false, message = "Aktif birim seçimi gereklidir" });
        }

        var actions = await _auditLogService.GetDistinctActionsAsync(scopedBirimId);
        return Ok(new { success = true, data = actions });
    }

    private bool IsStrictSuperAdmin()
    {
        return User.GetRoleName() == Roles.SuperAdmin;
    }
}
