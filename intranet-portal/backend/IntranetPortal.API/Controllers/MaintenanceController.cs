using IntranetPortal.API.Attributes;
using IntranetPortal.API.Extensions;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Maintenance;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using IntranetPortal.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

/// <summary>
/// Veritabanı bakım yönetimi API controller
/// PostgreSQL VACUUM, ANALYZE, REINDEX işlemlerini yönetir
/// Sadece SuperAdmin erişebilir
/// </summary>
[ApiController]
[Route("api/admin/maintenance")]
[Authorize]
public class MaintenanceController : ControllerBase
{
    private readonly IMaintenanceService _maintenanceService;
    private readonly IAuditLogService _auditLogService;

    public MaintenanceController(IMaintenanceService maintenanceService, IAuditLogService auditLogService)
    {
        _maintenanceService = maintenanceService;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Veritabanı genel istatistiklerini getirir
    /// </summary>
    [HttpGet("stats")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<MaintenanceStatsDto>>> GetStats()
    {
        var stats = await _maintenanceService.GetDatabaseStatsAsync();
        return Ok(ApiResponse<MaintenanceStatsDto>.Ok(stats));
    }

    /// <summary>
    /// Tüm tabloların istatistiklerini getirir
    /// </summary>
    [HttpGet("tables")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<List<TableStatsDto>>>> GetTableStats()
    {
        var tables = await _maintenanceService.GetTableStatsAsync();
        return Ok(ApiResponse<List<TableStatsDto>>.Ok(tables));
    }

    /// <summary>
    /// Bakım modu durumunu kontrol eder (Hafif kontrol)
    /// </summary>
    [HttpGet("status")]
    [Authorize] // Logged in users can see the status
    public async Task<ActionResult<ApiResponse<MaintenanceStatusDto>>> GetStatus()
    {
        try 
        {
            var status = await _maintenanceService.GetMaintenanceStatusAsync();
            return Ok(ApiResponse<MaintenanceStatusDto>.Ok(status));
        }
        catch
        {
            // DB erişilemiyorsa güvenli taraf (boş status) dönelim
            return Ok(ApiResponse<MaintenanceStatusDto>.Ok(new MaintenanceStatusDto())); 
        }
    }


    /// <summary>
    /// VACUUM işlemi çalıştırır
    /// </summary>
    [HttpPost("vacuum")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<MaintenanceResultDto>>> RunVacuum([FromBody] MaintenanceRequestDto? request)
    {
        var result = await _maintenanceService.RunVacuumAsync(request?.TableName);
        
        if (result.Success)
        {
            await LogMaintenanceActionAsync(AuditAction.MaintenanceVacuum, request?.TableName);
            return Ok(ApiResponse<MaintenanceResultDto>.Ok(result, result.Message));
        }
        
        return BadRequest(ApiResponse<MaintenanceResultDto>.Fail(result.Message));
    }

    /// <summary>
    /// VACUUM FULL işlemi çalıştırır
    /// </summary>
    [HttpPost("vacuum-full")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<MaintenanceResultDto>>> RunVacuumFull([FromBody] MaintenanceRequestDto? request)
    {
        var result = await _maintenanceService.RunVacuumFullAsync(request?.TableName);
        
        if (result.Success)
        {
            await LogMaintenanceActionAsync(AuditAction.MaintenanceVacuumFull, request?.TableName);
            return Ok(ApiResponse<MaintenanceResultDto>.Ok(result, result.Message));
        }
        
        return BadRequest(ApiResponse<MaintenanceResultDto>.Fail(result.Message));
    }

    /// <summary>
    /// ANALYZE işlemi çalıştırır
    /// </summary>
    [HttpPost("analyze")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<MaintenanceResultDto>>> RunAnalyze([FromBody] MaintenanceRequestDto? request)
    {
        var result = await _maintenanceService.RunAnalyzeAsync(request?.TableName);
        
        if (result.Success)
        {
            await LogMaintenanceActionAsync(AuditAction.MaintenanceAnalyze, request?.TableName);
            return Ok(ApiResponse<MaintenanceResultDto>.Ok(result, result.Message));
        }
        
        return BadRequest(ApiResponse<MaintenanceResultDto>.Fail(result.Message));
    }

    /// <summary>
    /// REINDEX işlemi çalıştırır
    /// </summary>
    [HttpPost("reindex")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<MaintenanceResultDto>>> RunReindex([FromBody] MaintenanceRequestDto? request)
    {
        var result = await _maintenanceService.RunReindexAsync(request?.TableName);
        
        if (result.Success)
        {
            await LogMaintenanceActionAsync(AuditAction.MaintenanceReindex, request?.TableName);
            return Ok(ApiResponse<MaintenanceResultDto>.Ok(result, result.Message));
        }
        
        return BadRequest(ApiResponse<MaintenanceResultDto>.Fail(result.Message));
    }

    /// <summary>
    /// Manuel bakım modunu açar/kapatır
    /// </summary>
    [HttpPost("mode")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleMaintenanceMode([FromBody] ToggleMaintenanceRequestDto request)
    {
        await _maintenanceService.ToggleMaintenanceModeAsync(request.Enabled, request.Message);
        
        // Log action
        var action = request.Enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled";
        await LogMaintenanceActionAsync(AuditAction.SystemConfigurationUpdate, action);

        return Ok(ApiResponse<bool>.Ok(request.Enabled, "Bakım modu güncellendi"));
    }
    [HttpPost("schedule")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<ActionResult<ApiResponse<bool>>> ScheduleMaintenance([FromBody] ScheduleMaintenanceRequestDto request)
    {
        if (request.CancelSchedule)
        {
            await _maintenanceService.ScheduleMaintenanceAsync(null, null);
            await LogMaintenanceActionAsync(AuditAction.SystemConfigurationUpdate, "Planlı bakım iptal edildi");
            return Ok(ApiResponse<bool>.Ok(true, "Planlı bakım iptal edildi"));
        }

        if (!request.ScheduledTime.HasValue)
        {
             return BadRequest(ApiResponse<bool>.Fail("Tarih alanı zorunludur"));
        }

        if (request.ScheduledTime.Value <= DateTime.Now)
        {
             return BadRequest(ApiResponse<bool>.Fail("Planlanan tarih gelecekte olmalıdır"));
        }

        await _maintenanceService.ScheduleMaintenanceAsync(request.ScheduledTime, request.Message);

        await LogMaintenanceActionAsync(
            AuditAction.SystemConfigurationUpdate,
            $"Planlı bakım oluşturuldu: {request.ScheduledTime}. Mesaj: {request.Message}"
        );

        return Ok(ApiResponse<bool>.Ok(true, "Planlı bakım oluşturuldu"));
    }

    /// <summary>
    /// Bakım işlemini audit log'a kaydet
    /// </summary>
    private async Task LogMaintenanceActionAsync(AuditAction action, string? tableName)
    {
        try
        {
            var userId = User.GetUserId();
            var birimId = User.GetBirimId();
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            var details = string.IsNullOrEmpty(tableName) 
                ? "Tüm veritabanı üzerinde işlem yapıldı" 
                : $"Tablo: {tableName}";
            
            await _auditLogService.CreateLogAsync(
                userId, birimId,
                action.ToString(),
                "Maintenance",
                details,
                ipAddress);
        }
        catch (Exception)
        {
            // Audit log hatası bakım işlemini engellememeli
            // Log zaten service içinde yapılıyor
        }
    }
}
