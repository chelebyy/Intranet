namespace IntranetPortal.Application.Settings;

/// <summary>
/// Yedekleme ayarları konfigürasyon sınıfı
/// appsettings.json'dan okunur
/// </summary>
public class BackupSettings
{
    public const string SectionName = "BackupSettings";
    
    /// <summary>
    /// Yedekleme dosyalarının saklanacağı dizin
    /// </summary>
    public string BackupDirectory { get; set; } = @"C:\Backups";
    
    /// <summary>
    /// Yedekleme log dosyasının yolu
    /// </summary>
    public string LogFilePath { get; set; } = @"C:\Backups\backup.log";
    
    /// <summary>
    /// PostgreSQL yedekleme PowerShell script yolu
    /// </summary>
    public string ScriptPath { get; set; } = string.Empty;
}
