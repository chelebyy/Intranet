using System.Diagnostics;
using System.Text.RegularExpressions;
using IntranetPortal.Application.DTOs.Maintenance;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Infrastructure.Data;
using IntranetPortal.Domain.Constants;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace IntranetPortal.Application.Services;

/// <summary>
/// Veritabanı bakım işlemleri servisi implementasyonu
/// PostgreSQL VACUUM, ANALYZE, REINDEX işlemlerini yönetir
/// </summary>
public class MaintenanceService : IMaintenanceService
{
    private readonly IntranetDbContext _context;
    private readonly ILogger<MaintenanceService> _logger;

    // Static thread-safe maintenance running flag with lock (shared across all instances)
    private static readonly object _maintenanceLock = new();
    private static bool _isMaintenanceRunning;

    // Regex for validating table names (prevent SQL injection)
    private static readonly Regex TableNameRegex = new(@"^[a-zA-Z_][a-zA-Z0-9_]*$", RegexOptions.Compiled);

    public MaintenanceService(IntranetDbContext context, ILogger<MaintenanceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<MaintenanceStatsDto> GetDatabaseStatsAsync()
    {
        var stats = new MaintenanceStatsDto
        {
            IsMaintenanceRunning = _isMaintenanceRunning,
            IsManualMaintenanceEnabled = await IsManualMaintenanceEnabledAsync()
        };

        // If manual maintenance is enabled, fetch the message
        if (stats.IsManualMaintenanceEnabled)
        {
            var msgSetting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeMessage);
            stats.MaintenanceMessage = msgSetting?.SettingValue;
        }

        // Scheduled Maintenance Status
        var scheduledTimeSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledTime);
        var scheduledMessageSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledMessage);

        DateTime? scheduledTime = null;
        if (scheduledTimeSetting != null && DateTime.TryParse(scheduledTimeSetting.SettingValue, out var parsedTime))
        {
            scheduledTime = parsedTime;
        }

        stats.ScheduledMaintenanceTime = scheduledTime;
        stats.ScheduledMaintenanceMessage = scheduledMessageSetting?.SettingValue;



        var connectionString = _context.Database.GetConnectionString();

        try
        {
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            // 1. Veritabanı adı ve boyutu
            await using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
                    SELECT 
                        current_database() as database_name,
                        pg_size_pretty(pg_database_size(current_database())) as database_size";
                
                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    stats.DatabaseName = reader.GetString(0);
                    stats.DatabaseSize = reader.GetString(1);
                }
            }

            // 2. Tablo ve index sayısı
            await using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
                    SELECT 
                        (SELECT COUNT(*) FROM pg_stat_user_tables) as table_count,
                        (SELECT COUNT(*) FROM pg_stat_user_indexes) as index_count";
                
                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    stats.TotalTables = Convert.ToInt32(reader.GetValue(0));
                    stats.TotalIndexes = Convert.ToInt32(reader.GetValue(1));
                }
            }

            // 3. Toplam tuple sayıları
            await using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
                    SELECT 
                        COALESCE(SUM(n_live_tup), 0) as live_tuples,
                        COALESCE(SUM(n_dead_tup), 0) as dead_tuples
                    FROM pg_stat_user_tables";
                
                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    stats.TotalLiveTuples = Convert.ToInt64(reader.GetValue(0));
                    stats.TotalDeadTuples = Convert.ToInt64(reader.GetValue(1));
                }
            }

            // 4. Son bakım tarihi
            await using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
                    SELECT MAX(GREATEST(
                        COALESCE(last_vacuum, '1970-01-01'),
                        COALESCE(last_autovacuum, '1970-01-01'),
                        COALESCE(last_analyze, '1970-01-01'),
                        COALESCE(last_autoanalyze, '1970-01-01')
                    )) as last_maintenance
                    FROM pg_stat_user_tables";
                
                var result = await cmd.ExecuteScalarAsync();
                if (result != null && result != DBNull.Value)
                {
                    var date = Convert.ToDateTime(result);
                    if (date > new DateTime(1970, 1, 2))
                    {
                        stats.LastMaintenanceDate = date;
                    }
                }
            }

            // 5. Aktif bağlantı sayısı
            await using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"SELECT COUNT(*) FROM pg_stat_activity WHERE datname = current_database()";
                var count = await cmd.ExecuteScalarAsync();
                stats.ActiveConnections = Convert.ToInt32(count);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting database stats");
        }

        return stats;
    }

    public async Task<List<TableStatsDto>> GetTableStatsAsync()
    {
        var tables = new List<TableStatsDto>();

        try
        {
            var connectionString = _context.Database.GetConnectionString();
            
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            await using var cmd = connection.CreateCommand();
            cmd.CommandText = @"
                SELECT 
                    schemaname as schema_name,
                    relname as table_name,
                    pg_size_pretty(pg_table_size(quote_ident(schemaname) || '.' || quote_ident(relname))) as table_size,
                    pg_size_pretty(pg_indexes_size(quote_ident(schemaname) || '.' || quote_ident(relname))) as index_size,
                    COALESCE(n_live_tup, 0) as live_tuples,
                    COALESCE(n_dead_tup, 0) as dead_tuples,
                    last_vacuum,
                    last_autovacuum,
                    last_analyze,
                    last_autoanalyze
                FROM pg_stat_user_tables
                ORDER BY pg_table_size(quote_ident(schemaname) || '.' || quote_ident(relname)) DESC";

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                tables.Add(new TableStatsDto
                {
                    SchemaName = reader.GetString(0),
                    TableName = reader.GetString(1),
                    TableSize = reader.GetString(2),
                    IndexSize = reader.GetString(3),
                    LiveTuples = reader.GetInt64(4),
                    DeadTuples = reader.GetInt64(5),
                    LastVacuum = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                    LastAutoVacuum = reader.IsDBNull(7) ? null : reader.GetDateTime(7),
                    LastAnalyze = reader.IsDBNull(8) ? null : reader.GetDateTime(8),
                    LastAutoAnalyze = reader.IsDBNull(9) ? null : reader.GetDateTime(9)
                });
            }
            

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting table stats");
        }

        return tables;
    }

    public async Task<MaintenanceResultDto> RunVacuumAsync(string? tableName = null)
    {
        return await RunMaintenanceOperationAsync(MaintenanceOperationType.Vacuum, tableName, "VACUUM");
    }

    public async Task<MaintenanceResultDto> RunVacuumFullAsync(string? tableName = null)
    {
        return await RunMaintenanceOperationAsync(MaintenanceOperationType.VacuumFull, tableName, "VACUUM FULL");
    }

    public async Task<MaintenanceResultDto> RunAnalyzeAsync(string? tableName = null)
    {
        return await RunMaintenanceOperationAsync(MaintenanceOperationType.Analyze, tableName, "ANALYZE");
    }

    public async Task<MaintenanceResultDto> RunReindexAsync(string? tableName = null)
    {
        if (string.IsNullOrEmpty(tableName))
        {
            return await RunMaintenanceOperationAsync(MaintenanceOperationType.Reindex, null, "REINDEX DATABASE");
        }
        return await RunMaintenanceOperationAsync(MaintenanceOperationType.Reindex, tableName, "REINDEX TABLE");
    }

    /// <summary>
    /// Genel bakım işlemi çalıştırıcı
    /// </summary>
    private async Task<MaintenanceResultDto> RunMaintenanceOperationAsync(
        MaintenanceOperationType operationType, 
        string? tableName, 
        string command)
    {
        var result = new MaintenanceResultDto
        {
            OperationType = operationType,
            TableName = tableName,
            StartedAt = DateTime.UtcNow
        };

        // Thread-safe check
        lock (_maintenanceLock)
        {
            if (_isMaintenanceRunning)
            {
                result.Success = false;
                result.Message = "Bir bakım işlemi zaten çalışıyor. Lütfen bekleyin.";
                return result;
            }
            _isMaintenanceRunning = true;
        }

        var stopwatch = Stopwatch.StartNew();

        try
        {
            string sql;
            
            if (string.IsNullOrEmpty(tableName))
            {
                // Tüm veritabanı için işlem
                if (operationType == MaintenanceOperationType.Reindex)
                {
                    // REINDEX DATABASE için veritabanı adı gerekli
                    sql = $"{command} \"{_context.Database.GetDbConnection().Database}\"";
                }
                else
                {
                    sql = command;
                }
            }
            else
            {
                // Tablo adı doğrulama (SQL injection koruması)
                if (!IsValidTableName(tableName))
                {
                    result.Success = false;
                    result.Message = "Geçersiz tablo adı.";
                    return result;
                }

                // Tablo var mı kontrol et
                if (!await TableExistsAsync(tableName))
                {
                    result.Success = false;
                    result.Message = $"Tablo bulunamadı: {tableName}";
                    return result;
                }

                sql = $"{command} \"{tableName}\"";
            }

            _logger.LogInformation("Running maintenance: {Command} on {Target}", 
                command, 
                string.IsNullOrEmpty(tableName) ? "DATABASE" : tableName);

            // PostgreSQL bakım komutu çalıştır
            // Not: Bu komutlar transaction içinde çalışamaz
            // ÖNEMLİ: EF Core'un bağlantısını kullanmak yerine yeni bir bağlantı oluştur
            // çünkü EF Core'un bağlantısını dispose etmek diğer işlemleri bozar
            var connectionString = _context.Database.GetConnectionString();
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();
            
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = sql;
            cmd.CommandTimeout = 3600; // 1 saat timeout (büyük tablolar için)
            
            await cmd.ExecuteNonQueryAsync();

            stopwatch.Stop();
            result.Success = true;
            result.DurationMs = stopwatch.ElapsedMilliseconds;
            result.CompletedAt = DateTime.UtcNow;
            result.Message = $"{command} işlemi başarıyla tamamlandı. Süre: {stopwatch.ElapsedMilliseconds}ms";

            _logger.LogInformation("Maintenance completed: {Command} on {Target} in {Duration}ms",
                command,
                string.IsNullOrEmpty(tableName) ? "DATABASE" : tableName,
                stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            result.Success = false;
            result.DurationMs = stopwatch.ElapsedMilliseconds;
            result.Message = $"Bakım işlemi başarısız: {ex.Message}";

            _logger.LogError(ex, "Maintenance failed: {Command} on {Target}",
                command,
                string.IsNullOrEmpty(tableName) ? "DATABASE" : tableName);
        }
        finally
        {
            lock (_maintenanceLock)
            {
                _isMaintenanceRunning = false;
            }
        }

        return result;
    }

    public async Task ToggleMaintenanceModeAsync(bool enabled, string? message = null)
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeIsEnabled);

        if (setting == null)
        {
            setting = new SystemSettings
            {
                SettingKey = SystemSettingKeys.MaintenanceModeIsEnabled,
                SettingValue = enabled.ToString(),
                Description = "Maintenance Mode Status"
            };
            _context.SystemSettings.Add(setting);
        }
        else
        {
            setting.SettingValue = enabled.ToString();
            setting.UpdatedAt = DateTime.UtcNow;
        }

        // Setting Message
        if (message != null)
        {
            var msgSetting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeMessage);

            if (msgSetting == null)
            {
                msgSetting = new SystemSettings
                {
                    SettingKey = SystemSettingKeys.MaintenanceModeMessage,
                    SettingValue = message,
                    Description = "Maintenance Mode Message"
                };
                _context.SystemSettings.Add(msgSetting);
            }
            else
            {
                msgSetting.SettingValue = message;
                msgSetting.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsManualMaintenanceEnabledAsync()
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeIsEnabled);
        
        return setting != null && bool.TryParse(setting.SettingValue, out var result) && result;
    }

    /// <summary>
    /// Tablo adı doğrulama (SQL injection koruması)
    /// </summary>
    private static bool IsValidTableName(string tableName)
    {
        return !string.IsNullOrWhiteSpace(tableName) && TableNameRegex.IsMatch(tableName);
    }

    /// <summary>
    /// Tablo var mı kontrol et
    /// </summary>
    private async Task<bool> TableExistsAsync(string tableName)
    {
        var connectionString = _context.Database.GetConnectionString();
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        await using var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT EXISTS (SELECT 1 FROM pg_stat_user_tables WHERE relname = @tableName)";
        cmd.Parameters.AddWithValue("tableName", tableName);

        var result = await cmd.ExecuteScalarAsync();
        return result is bool exists && exists;
    }
    public async Task<MaintenanceStatusDto> GetMaintenanceStatusAsync()
    {
        var stats = new MaintenanceStatusDto
        {
            IsMaintenanceActive = _isMaintenanceRunning,
            IsManualMaintenanceEnabled = await IsManualMaintenanceEnabledAsync()
        };

        if (stats.IsManualMaintenanceEnabled)
        {
            var msgSetting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeMessage);
            stats.MaintenanceMessage = msgSetting?.SettingValue;
        }

        var scheduledTimeSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledTime);
        var scheduledMessageSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledMessage);

        if (scheduledTimeSetting != null && DateTime.TryParse(scheduledTimeSetting.SettingValue, out var parsedTime))
        {
            stats.ScheduledMaintenanceTime = parsedTime;
        }
        stats.ScheduledMaintenanceMessage = scheduledMessageSetting?.SettingValue;

        return stats;
    }

    public async Task ScheduleMaintenanceAsync(DateTime? time, string? message)
    {
        var timeSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledTime);
        var messageSetting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceScheduledMessage);

        if (time.HasValue)
        {
            if (timeSetting == null)
            {
                timeSetting = new SystemSettings { SettingKey = SystemSettingKeys.MaintenanceScheduledTime };
                _context.SystemSettings.Add(timeSetting);
            }
            timeSetting.SettingValue = time.Value.ToString("o"); // ISO 8601
        }
        else
        {
            if (timeSetting != null) _context.SystemSettings.Remove(timeSetting);
        }

        if (!string.IsNullOrEmpty(message))
        {
            if (messageSetting == null)
            {
                messageSetting = new SystemSettings { SettingKey = SystemSettingKeys.MaintenanceScheduledMessage };
                _context.SystemSettings.Add(messageSetting);
            }
            messageSetting.SettingValue = message;
        }
        else if (!time.HasValue) // Only remove message if we are also removing time (cancelling)
        {
            if (messageSetting != null) _context.SystemSettings.Remove(messageSetting);
        }

        await _context.SaveChangesAsync();
    }
}
