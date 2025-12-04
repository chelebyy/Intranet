using System.Diagnostics;
using IntranetPortal.Application.DTOs.Backup;
using IntranetPortal.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Yedekleme işlemleri servisi implementasyonu
/// </summary>
public class BackupService : IBackupService
{
    private readonly ILogger<BackupService> _logger;
    private readonly string _backupDirectory = @"C:\Backups";
    private readonly string _logFilePath = @"C:\Backups\backup.log";
    private readonly string _scriptPath = @"C:\Users\IT\Desktop\Bilişim Sistemi\intranet-portal\scripts\PostgreSQLBackup.ps1";
    private static bool _isBackupRunning;

    public BackupService(ILogger<BackupService> logger)
    {
        _logger = logger;
    }

    public async Task<List<BackupFileDto>> GetBackupFilesAsync()
    {
        var files = new List<BackupFileDto>();

        try
        {
            if (!Directory.Exists(_backupDirectory))
            {
                _logger.LogWarning("Backup directory does not exist: {Directory}", _backupDirectory);
                return files;
            }

            var backupFiles = Directory.GetFiles(_backupDirectory, "*.backup")
                .Select(f => new FileInfo(f))
                .OrderByDescending(f => f.CreationTime);

            foreach (var file in backupFiles)
            {
                files.Add(new BackupFileDto
                {
                    FileName = file.Name,
                    SizeBytes = file.Length,
                    SizeFormatted = FormatFileSize(file.Length),
                    CreatedAt = file.CreationTime
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting backup files");
        }

        return await Task.FromResult(files);
    }

    public async Task<BackupStatsDto> GetBackupStatsAsync()
    {
        var stats = new BackupStatsDto
        {
            IsBackupRunning = _isBackupRunning
        };

        try
        {
            if (Directory.Exists(_backupDirectory))
            {
                var backupFiles = Directory.GetFiles(_backupDirectory, "*.backup")
                    .Select(f => new FileInfo(f))
                    .ToList();

                stats.BackupCount = backupFiles.Count;

                if (backupFiles.Any())
                {
                    stats.LastBackupDate = backupFiles.Max(f => f.CreationTime);
                    var totalSize = backupFiles.Sum(f => f.Length);
                    stats.TotalSizeFormatted = FormatFileSize(totalSize);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting backup stats");
        }

        return await Task.FromResult(stats);
    }

    public async Task<BackupTriggerResultDto> TriggerBackupAsync()
    {
        if (_isBackupRunning)
        {
            return new BackupTriggerResultDto
            {
                Success = false,
                Message = "Bir yedekleme işlemi zaten çalışıyor. Lütfen bekleyin."
            };
        }

        try
        {
            _isBackupRunning = true;
            _logger.LogInformation("Manual backup triggered");

            // PowerShell scriptini çalıştır
            var startInfo = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-ExecutionPolicy Bypass -File \"{_scriptPath}\"",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            using var process = Process.Start(startInfo);
            if (process != null)
            {
                await process.WaitForExitAsync();
                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();

                if (process.ExitCode == 0)
                {
                    _logger.LogInformation("Backup completed successfully");
                    return new BackupTriggerResultDto
                    {
                        Success = true,
                        Message = "Yedekleme başarıyla tamamlandı.",
                        StartedAt = DateTime.Now
                    };
                }
                else
                {
                    _logger.LogError("Backup failed with exit code {ExitCode}: {Error}", process.ExitCode, error);
                    return new BackupTriggerResultDto
                    {
                        Success = false,
                        Message = $"Yedekleme başarısız oldu: {error}"
                    };
                }
            }

            return new BackupTriggerResultDto
            {
                Success = false,
                Message = "PowerShell process başlatılamadı."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during backup trigger");
            return new BackupTriggerResultDto
            {
                Success = false,
                Message = $"Hata: {ex.Message}"
            };
        }
        finally
        {
            _isBackupRunning = false;
        }
    }

    public async Task<(Stream? FileStream, string? ContentType, string? FileName)> GetBackupFileAsync(string fileName)
    {
        try
        {
            // Güvenlik: Path traversal koruması
            var sanitizedFileName = Path.GetFileName(fileName);
            if (string.IsNullOrEmpty(sanitizedFileName) || sanitizedFileName != fileName)
            {
                _logger.LogWarning("Invalid file name requested: {FileName}", fileName);
                return (null, null, null);
            }

            // Sadece .backup uzantılı dosyalar
            if (!sanitizedFileName.EndsWith(".backup", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Non-backup file requested: {FileName}", fileName);
                return (null, null, null);
            }

            var filePath = Path.Combine(_backupDirectory, sanitizedFileName);

            // Dosya yolunun backup dizini içinde olduğundan emin ol
            var fullPath = Path.GetFullPath(filePath);
            if (!fullPath.StartsWith(_backupDirectory, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Path traversal attempt detected: {FileName}", fileName);
                return (null, null, null);
            }

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning("Backup file not found: {FilePath}", fullPath);
                return (null, null, null);
            }

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return await Task.FromResult((stream as Stream, "application/octet-stream", sanitizedFileName));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting backup file: {FileName}", fileName);
            return (null, null, null);
        }
    }

    public async Task<List<string>> GetRecentLogsAsync(int lineCount = 50)
    {
        var logs = new List<string>();

        try
        {
            if (!File.Exists(_logFilePath))
            {
                logs.Add("Log dosyası bulunamadı.");
                return logs;
            }

            // Dosyayı oku (shared read ile)
            var allLines = await File.ReadAllLinesAsync(_logFilePath);
            logs = allLines.TakeLast(lineCount).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading backup logs");
            logs.Add($"Log okuma hatası: {ex.Message}");
        }

        return logs;
    }

    public async Task<bool> DeleteBackupAsync(string fileName)
    {
        try
        {
            // Güvenlik: Path traversal koruması
            var sanitizedFileName = Path.GetFileName(fileName);
            if (string.IsNullOrEmpty(sanitizedFileName) || sanitizedFileName != fileName)
            {
                _logger.LogWarning("Invalid file name for deletion: {FileName}", fileName);
                return false;
            }

            if (!sanitizedFileName.EndsWith(".backup", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Attempted to delete non-backup file: {FileName}", fileName);
                return false;
            }

            var filePath = Path.Combine(_backupDirectory, sanitizedFileName);
            var fullPath = Path.GetFullPath(filePath);

            if (!fullPath.StartsWith(_backupDirectory, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Path traversal attempt on delete: {FileName}", fileName);
                return false;
            }

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning("Backup file not found for deletion: {FilePath}", fullPath);
                return false;
            }

            File.Delete(fullPath);
            _logger.LogInformation("Backup file deleted: {FileName}", sanitizedFileName);
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting backup file: {FileName}", fileName);
            return false;
        }
    }

    private static string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB", "TB" };
        double len = bytes;
        int order = 0;

        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len /= 1024;
        }

        return $"{len:0.##} {sizes[order]}";
    }
}
