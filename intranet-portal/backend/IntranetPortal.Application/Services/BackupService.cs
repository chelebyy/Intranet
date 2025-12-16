using System.Diagnostics;
using IntranetPortal.Application.DTOs.Backup;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Application.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Yedekleme işlemleri servisi implementasyonu
/// DI container'da Singleton olarak kayıtlı olmalıdır!
/// </summary>
public class BackupService : IBackupService
{
    private readonly ILogger<BackupService> _logger;
    private readonly BackupSettings _settings;
    
    // Thread-safe backup running flag with lock
    // Instance field kullanılıyor çünkü servis Singleton olarak kayıtlı
    private readonly object _backupLock = new();
    private bool _isBackupRunning;

    public BackupService(ILogger<BackupService> logger, IOptions<BackupSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
    }

    public async Task<List<BackupFileDto>> GetBackupFilesAsync()
    {
        var files = new List<BackupFileDto>();

        try
        {
            if (!Directory.Exists(_settings.BackupDirectory))
            {
                _logger.LogWarning("Backup directory does not exist: {Directory}", _settings.BackupDirectory);
                return files;
            }

            var backupFiles = Directory.GetFiles(_settings.BackupDirectory, "*.backup")
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
            if (Directory.Exists(_settings.BackupDirectory))
            {
                var backupFiles = Directory.GetFiles(_settings.BackupDirectory, "*.backup")
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
        // Thread-safe check and set using lock
        lock (_backupLock)
        {
            if (_isBackupRunning)
            {
                return new BackupTriggerResultDto
                {
                    Success = false,
                    Message = "Bir yedekleme işlemi zaten çalışıyor. Lütfen bekleyin."
                };
            }
            _isBackupRunning = true;
        }

        try
        {
            _logger.LogInformation("Manual backup triggered");

            // Security: Validate script path before execution
            var scriptPath = ResolveScriptPath(_settings.ScriptPath);
            
            // Check if script path is configured
            if (string.IsNullOrWhiteSpace(scriptPath))
            {
                _logger.LogError("Backup script path is not configured");
                return new BackupTriggerResultDto
                {
                    Success = false,
                    Message = "Yedekleme script yolu yapılandırılmamış."
                };
            }
            
            // Security: Validate script path extension (only .ps1 allowed)
            if (!scriptPath.EndsWith(".ps1", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Invalid script extension attempted: {ScriptPath}", scriptPath);
                return new BackupTriggerResultDto
                {
                    Success = false,
                    Message = "Geçersiz script uzantısı."
                };
            }
            
            // Security: Verify script file exists
            if (!File.Exists(scriptPath))
            {
                _logger.LogError("Backup script not found: {ScriptPath}", scriptPath);
                return new BackupTriggerResultDto
                {
                    Success = false,
                    Message = $"Yedekleme scripti bulunamadı: {scriptPath}"
                };
            }

            // PowerShell scriptini çalıştır
            // Security Note: Script path comes from trusted configuration (appsettings.json)
            // and is validated above. No user input is used in command construction.
            var startInfo = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-ExecutionPolicy Bypass -NoProfile -NonInteractive -File \"{scriptPath}\"",
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
            // Thread-safe reset using lock
            lock (_backupLock)
            {
                _isBackupRunning = false;
            }
        }
    }

    /// <summary>
    /// Gets backup file stream for download.
    /// IMPORTANT: Caller is responsible for disposing the returned stream!
    /// The stream should be used with 'using' statement or in a context that handles disposal.
    /// </summary>
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

            var filePath = Path.Combine(_settings.BackupDirectory, sanitizedFileName);

            // Dosya yolunun backup dizini içinde olduğundan emin ol
            var fullPath = Path.GetFullPath(filePath);
            if (!fullPath.StartsWith(_settings.BackupDirectory, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Path traversal attempt detected: {FileName}", fileName);
                return (null, null, null);
            }

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning("Backup file not found: {FilePath}", fullPath);
                return (null, null, null);
            }

            // Stream will be disposed by ASP.NET Core after the response is sent
            // FileStreamResult or File() method handles disposal automatically
            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return await Task.FromResult<(Stream?, string?, string?)>((stream, "application/octet-stream", sanitizedFileName));
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
            if (!File.Exists(_settings.LogFilePath))
            {
                logs.Add("Log dosyası bulunamadı.");
                return logs;
            }

            // Dosyayı oku (shared read ile)
            var allLines = await File.ReadAllLinesAsync(_settings.LogFilePath);
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

            var filePath = Path.Combine(_settings.BackupDirectory, sanitizedFileName);
            var fullPath = Path.GetFullPath(filePath);

            if (!fullPath.StartsWith(_settings.BackupDirectory, StringComparison.OrdinalIgnoreCase))
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

    /// <summary>
    /// Script yolunu çözer - hem mutlak hem de göreli yolları destekler
    /// Bu sayede proje farklı makinelerde çalışabilir
    /// </summary>
    private static string? ResolveScriptPath(string? configuredPath)
    {
        if (string.IsNullOrWhiteSpace(configuredPath))
            return null;

        // 1. Eğer mutlak yol ve dosya varsa, direkt kullan
        if (Path.IsPathRooted(configuredPath) && File.Exists(configuredPath))
            return configuredPath;

        // 2. Uygulama base dizininden göreli yol dene
        // (IntranetPortal.API/bin/Debug/net9.0 dizininden)
        var appBaseDir = AppContext.BaseDirectory;
        var fromAppBase = Path.GetFullPath(Path.Combine(appBaseDir, configuredPath));
        if (File.Exists(fromAppBase))
            return fromAppBase;

        // 3. Proje kök dizininden scripts klasörüne bak
        // AppContext.BaseDirectory genellikle: .../IntranetPortal.API/bin/Debug/net9.0/
        // Proje kökü: 4 seviye yukarı -> intranet-portal/backend/IntranetPortal.API -> intranet-portal
        // Sonra scripts klasörüne git
        var projectRoot = Path.GetFullPath(Path.Combine(appBaseDir, "..", "..", "..", "..", ".."));
        var scriptFileName = Path.GetFileName(configuredPath);
        var fromProjectScripts = Path.Combine(projectRoot, "scripts", scriptFileName);
        if (File.Exists(fromProjectScripts))
            return fromProjectScripts;

        // 4. Sadece dosya adı verilmişse, scripts klasöründe ara
        if (!configuredPath.Contains(Path.DirectorySeparatorChar) && !configuredPath.Contains('/'))
        {
            var simpleScriptPath = Path.Combine(projectRoot, "scripts", configuredPath);
            if (File.Exists(simpleScriptPath))
                return simpleScriptPath;
        }

        // 5. Hiçbiri bulunamazsa, orijinal yolu döndür (hata mesajı için)
        return configuredPath;
    }
}
