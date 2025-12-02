using IntranetPortal.API.Attributes;
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
        var log = await _auditLogService.GetByIdAsync(id);
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
        var actions = await _auditLogService.GetDistinctActionsAsync();
        return Ok(new { success = true, data = actions });
    }
}
