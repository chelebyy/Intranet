namespace IntranetPortal.Application.DTOs.Maintenance;

/// <summary>
/// Veritabanı bakım işlemi türü
/// </summary>
public enum MaintenanceOperationType
{
    Vacuum,
    VacuumFull,
    Analyze,
    Reindex
}

/// <summary>
/// Veritabanı genel istatistikleri DTO
/// </summary>
public class MaintenanceStatsDto
{
    /// <summary>
    /// Veritabanı adı
    /// </summary>
    public string DatabaseName { get; set; } = string.Empty;

    /// <summary>
    /// Veritabanı toplam boyutu (formatlanmış)
    /// </summary>
    public string DatabaseSize { get; set; } = "0 B";

    /// <summary>
    /// Toplam tablo sayısı
    /// </summary>
    public int TotalTables { get; set; }

    /// <summary>
    /// Toplam index sayısı
    /// </summary>
    public int TotalIndexes { get; set; }

    /// <summary>
    /// Toplam ölü tuple sayısı
    /// </summary>
    public long TotalDeadTuples { get; set; }

    /// <summary>
    /// Toplam canlı tuple sayısı
    /// </summary>
    public long TotalLiveTuples { get; set; }

    /// <summary>
    /// Son bakım tarihi
    /// </summary>
    public DateTime? LastMaintenanceDate { get; set; }

    /// <summary>
    /// Aktif bağlantı sayısı
    /// </summary>
    public int ActiveConnections { get; set; }

    /// <summary>
    /// Bakım işlemi çalışıyor mu?
    /// </summary>
    public bool IsMaintenanceRunning { get; set; }

    /// <summary>
    /// Manuel bakım modu açık mı?
    /// </summary>
    public bool IsManualMaintenanceEnabled { get; set; }

    /// <summary>
    /// Bakım mesajı
    /// </summary>
    public string? MaintenanceMessage { get; set; }

    public DateTime? ScheduledMaintenanceTime { get; set; }
    public string? ScheduledMaintenanceMessage { get; set; }
}

/// <summary>
/// Tablo bazlı istatistikler DTO
/// </summary>
public class TableStatsDto
{
    /// <summary>
    /// Şema adı
    /// </summary>
    public string SchemaName { get; set; } = "public";

    /// <summary>
    /// Tablo adı
    /// </summary>
    public string TableName { get; set; } = string.Empty;

    /// <summary>
    /// Tablo boyutu (formatlanmış)
    /// </summary>
    public string TableSize { get; set; } = "0 B";

    /// <summary>
    /// Index boyutu (formatlanmış)
    /// </summary>
    public string IndexSize { get; set; } = "0 B";

    /// <summary>
    /// Canlı tuple sayısı
    /// </summary>
    public long LiveTuples { get; set; }

    /// <summary>
    /// Ölü tuple sayısı
    /// </summary>
    public long DeadTuples { get; set; }

    /// <summary>
    /// Son VACUUM tarihi
    /// </summary>
    public DateTime? LastVacuum { get; set; }

    /// <summary>
    /// Son AutoVacuum tarihi
    /// </summary>
    public DateTime? LastAutoVacuum { get; set; }

    /// <summary>
    /// Son ANALYZE tarihi
    /// </summary>
    public DateTime? LastAnalyze { get; set; }

    /// <summary>
    /// Son AutoAnalyze tarihi
    /// </summary>
    public DateTime? LastAutoAnalyze { get; set; }

    /// <summary>
    /// Ölü tuple oranı (%)
    /// </summary>
    public double DeadTuplePercentage => LiveTuples + DeadTuples > 0 
        ? Math.Round((double)DeadTuples / (LiveTuples + DeadTuples) * 100, 2) 
        : 0;

    /// <summary>
    /// Bakım gerekiyor mu? (>10% dead tuple)
    /// </summary>
    public bool NeedsMaintenance => DeadTuplePercentage > 10;
}

/// <summary>
/// Bakım işlemi sonucu DTO
/// </summary>
public class MaintenanceResultDto
{
    /// <summary>
    /// İşlem başarılı mı?
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// İşlem mesajı
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// İşlem türü
    /// </summary>
    public MaintenanceOperationType OperationType { get; set; }

    /// <summary>
    /// İşlem yapılan tablo (null ise tüm veritabanı)
    /// </summary>
    public string? TableName { get; set; }

    /// <summary>
    /// İşlem süresi (milisaniye)
    /// </summary>
    public long DurationMs { get; set; }

    /// <summary>
    /// İşlem başlangıç zamanı
    /// </summary>
    public DateTime StartedAt { get; set; }

    /// <summary>
    /// İşlem bitiş zamanı
    /// </summary>
    public DateTime? CompletedAt { get; set; }
}

/// <summary>
/// Bakım işlemi isteği DTO
/// </summary>
public class MaintenanceRequestDto
{
    /// <summary>
    /// Hedef tablo adı (null ise tüm veritabanı)
    /// </summary>
    public string? TableName { get; set; }
}

/// <summary>
/// Bakım modu toggle isteği
/// </summary>
public class ToggleMaintenanceRequestDto
{
    public bool Enabled { get; set; }
    public string? Message { get; set; }
}
