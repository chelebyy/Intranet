using IntranetPortal.API.Attributes;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Backup;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

/// <summary>
/// Yedekleme yönetimi API controller
/// Sadece SuperAdmin erişebilir
/// </summary>
[ApiController]
[Route("api/admin/backups")]
[Authorize]
public class BackupController : ControllerBase
{
    private readonly IBackupService _backupService;

    public BackupController(IBackupService backupService)
    {
        _backupService = backupService;
    }

    /// <summary>
    /// Yedekleme istatistiklerini getirir
    /// </summary>
    [HttpGet("stats")]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<ActionResult<ApiResponse<BackupStatsDto>>> GetStats()
    {
        var stats = await _backupService.GetBackupStatsAsync();
        return Ok(ApiResponse<BackupStatsDto>.Ok(stats));
    }

    /// <summary>
    /// Tüm yedek dosyalarını listeler
    /// </summary>
    [HttpGet]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<ActionResult<ApiResponse<List<BackupFileDto>>>> GetBackups()
    {
        var backups = await _backupService.GetBackupFilesAsync();
        return Ok(ApiResponse<List<BackupFileDto>>.Ok(backups));
    }

    /// <summary>
    /// Manuel yedekleme başlatır
    /// </summary>
    [HttpPost("trigger")]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<ActionResult<ApiResponse<BackupTriggerResultDto>>> TriggerBackup()
    {
        var result = await _backupService.TriggerBackupAsync();
        
        if (result.Success)
        {
            return Ok(ApiResponse<BackupTriggerResultDto>.Ok(result, "Yedekleme başarıyla tamamlandı."));
        }
        
        return BadRequest(ApiResponse<BackupTriggerResultDto>.Fail(result.Message));
    }

    /// <summary>
    /// Belirtilen yedek dosyasını indirir
    /// </summary>
    [HttpGet("{fileName}")]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<IActionResult> DownloadBackup(string fileName)
    {
        var (fileStream, contentType, actualFileName) = await _backupService.GetBackupFileAsync(fileName);
        
        if (fileStream == null)
        {
            return NotFound(ApiResponse<object>.Fail("Yedek dosyası bulunamadı."));
        }

        return File(fileStream, contentType!, actualFileName!);
    }

    /// <summary>
    /// Son yedekleme loglarını getirir
    /// </summary>
    [HttpGet("logs")]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetLogs([FromQuery] int lines = 50)
    {
        if (lines < 1 || lines > 500)
        {
            lines = 50;
        }

        var logs = await _backupService.GetRecentLogsAsync(lines);
        return Ok(ApiResponse<List<string>>.Ok(logs));
    }

    /// <summary>
    /// Belirtilen yedek dosyasını siler
    /// </summary>
    [HttpDelete("{fileName}")]
    [HasPermission(Permissions.ManageBackups)]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteBackup(string fileName)
    {
        var result = await _backupService.DeleteBackupAsync(fileName);
        
        if (result)
        {
            return Ok(ApiResponse<bool>.Ok(true, "Yedek dosyası silindi."));
        }
        
        return NotFound(ApiResponse<bool>.Fail("Yedek dosyası bulunamadı veya silinemedi."));
    }
}
