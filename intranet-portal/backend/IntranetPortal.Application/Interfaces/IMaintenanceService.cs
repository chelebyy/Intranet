using IntranetPortal.Application.DTOs.Maintenance;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Veritabanı bakım işlemleri servisi
/// PostgreSQL VACUUM, ANALYZE, REINDEX işlemlerini yönetir
/// </summary>
public interface IMaintenanceService
{
    /// <summary>
    /// Veritabanı genel istatistiklerini getirir
    /// </summary>
    Task<MaintenanceStatsDto> GetDatabaseStatsAsync();

    /// <summary>
    /// Tüm tabloların istatistiklerini getirir
    /// </summary>
    Task<List<TableStatsDto>> GetTableStatsAsync();

    /// <summary>
    /// VACUUM işlemi çalıştırır
    /// Ölü tuple'ları temizler, disk alanı geri kazanır
    /// </summary>
    /// <param name="tableName">Hedef tablo (null ise tüm veritabanı)</param>
    Task<MaintenanceResultDto> RunVacuumAsync(string? tableName = null);

    /// <summary>
    /// VACUUM FULL işlemi çalıştırır
    /// Tabloyu tamamen yeniden yazar, en fazla alan kazanır (kilit gerektirir)
    /// </summary>
    /// <param name="tableName">Hedef tablo (null ise tüm veritabanı)</param>
    Task<MaintenanceResultDto> RunVacuumFullAsync(string? tableName = null);

    /// <summary>
    /// ANALYZE işlemi çalıştırır
    /// Tablo istatistiklerini günceller (query planner için)
    /// </summary>
    /// <param name="tableName">Hedef tablo (null ise tüm veritabanı)</param>
    Task<MaintenanceResultDto> RunAnalyzeAsync(string? tableName = null);

    /// <summary>
    /// REINDEX işlemi çalıştırır
    /// Index'leri yeniden oluşturur
    /// </summary>
    /// <param name="tableName">Hedef tablo (null ise tüm veritabanı)</param>
    Task<MaintenanceResultDto> RunReindexAsync(string? tableName = null);

    /// <summary>
    /// Manuel bakım modunu açar/kapatır
    /// </summary>
    Task ToggleMaintenanceModeAsync(bool enabled, string? message = null);

    /// <summary>
    /// Manuel bakım modunun açık olup olmadığını kontrol eder
    /// </summary>
    Task<bool> IsManualMaintenanceEnabledAsync();
    /// <summary>
    /// Bakım planlar
    /// </summary>
    Task ScheduleMaintenanceAsync(DateTime? time, string? message);

    /// <summary>
    /// Bakım modu durumunu ve planını getirir (Hafif)
    /// </summary>
    Task<MaintenanceStatusDto> GetMaintenanceStatusAsync();
}
