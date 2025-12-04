namespace IntranetPortal.Application.DTOs.Backup;

/// <summary>
/// Yedek dosya bilgisi DTO
/// </summary>
public class BackupFileDto
{
    public string FileName { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string SizeFormatted { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Yedekleme tetikleme sonucu DTO
/// </summary>
public class BackupTriggerResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public DateTime? StartedAt { get; set; }
}

/// <summary>
/// Yedekleme istatistikleri DTO
/// </summary>
public class BackupStatsDto
{
    public DateTime? LastBackupDate { get; set; }
    public string TotalSizeFormatted { get; set; } = "0 B";
    public int BackupCount { get; set; }
    public bool IsBackupRunning { get; set; }
}
