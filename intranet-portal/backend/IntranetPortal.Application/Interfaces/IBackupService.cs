using IntranetPortal.Application.DTOs.Backup;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Yedekleme işlemleri servisi
/// </summary>
public interface IBackupService
{
    /// <summary>
    /// Tüm yedek dosyalarını listeler
    /// </summary>
    Task<List<BackupFileDto>> GetBackupFilesAsync();

    /// <summary>
    /// Yedekleme istatistiklerini getirir
    /// </summary>
    Task<BackupStatsDto> GetBackupStatsAsync();

    /// <summary>
    /// Manuel yedekleme başlatır
    /// </summary>
    Task<BackupTriggerResultDto> TriggerBackupAsync();

    /// <summary>
    /// Belirtilen yedek dosyasını stream olarak döner
    /// </summary>
    Task<(Stream? FileStream, string? ContentType, string? FileName)> GetBackupFileAsync(string fileName);

    /// <summary>
    /// Son yedekleme loglarını getirir
    /// </summary>
    Task<List<string>> GetRecentLogsAsync(int lineCount = 50);

    /// <summary>
    /// Belirtilen yedek dosyasını siler
    /// </summary>
    Task<bool> DeleteBackupAsync(string fileName);
}
