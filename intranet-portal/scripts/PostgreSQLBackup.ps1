$date = Get-Date -Format "yyyy-MM-dd_HHmm"
$backupDir = "C:\Backups"
$backupFile = "$backupDir\IntranetDB_$date.backup"
$logFile = "$backupDir\backup.log"

# Klasör kontrolü
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Log başlangıcı
"[$([DateTime]::Now)] Backup started: $backupFile" | Out-File -Append $logFile

try {
    # Yedekleme
    $env:PGPASSWORD = "SecurePassword123!"
    & "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" `
        -U intranet_user `
        -h localhost `
        -F c `
        -b -v `
        -f $backupFile `
        IntranetDB `
        2>&1 | Out-File -Append $logFile

    if ($LASTEXITCODE -eq 0) {
        "[$([DateTime]::Now)] Backup completed successfully." | Out-File -Append $logFile
    } else {
        "[$([DateTime]::Now)] Backup failed with exit code $LASTEXITCODE." | Out-File -Append $logFile
    }
}
catch {
    "[$([DateTime]::Now)] Error: $_" | Out-File -Append $logFile
}

# Eski yedekleri temizle (30 günden eski)
try {
    Get-ChildItem $backupDir -Filter "*.backup" |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
        ForEach-Object {
            Remove-Item $_.FullName -Force
            "[$([DateTime]::Now)] Deleted old backup: $($_.Name)" | Out-File -Append $logFile
        }
}
catch {
    "[$([DateTime]::Now)] Error cleaning old backups: $_" | Out-File -Append $logFile
}
