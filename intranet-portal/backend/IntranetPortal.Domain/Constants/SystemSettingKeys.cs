namespace IntranetPortal.Domain.Constants
{
    /// <summary>
    /// System settings key constants
    /// Matches settings defined in ERD.md
    /// Implements PRD FR-44 to FR-47
    /// </summary>
    public static class SystemSettingKeys
    {
        // Maintenance Mode (PRD FR-44, FR-45)
        public const string MaintenanceModeIsEnabled = "MaintenanceMode.IsEnabled";
        public const string MaintenanceModeMessage = "MaintenanceMode.Message";
        public const string MaintenanceScheduledTime = "Maintenance.Scheduled.Time";
        public const string MaintenanceScheduledMessage = "Maintenance.Scheduled.Message";

        // File Upload Settings (PRD FR-33 to FR-38)
        public const string FileUploadMaxSizeMB = "FileUpload.MaxSizeMB";
        public const string FileUploadAllowedExtensions = "FileUpload.AllowedExtensions";

        // Export Settings (PRD FR-46, FR-47)
        public const string ExportMaxRowsAuditLog = "Export.MaxRowsAuditLog";
        public const string ExportMaxRowsUsers = "Export.MaxRowsUsers";

        // Security Settings
        public const string SecurityPasswordMinLength = "Security.PasswordMinLength";
        public const string SecurityPasswordRequireSpecialChars = "Security.PasswordRequireSpecialChars";
        public const string SecuritySessionTimeoutMinutes = "Security.SessionTimeoutMinutes";
        public const string SecurityMaxLoginAttempts = "Security.MaxLoginAttempts";

        // System Information (PRD FR-44)
        public const string SystemVersion = "System.Version";
        public const string SystemLastUpdateDate = "System.LastUpdateDate";
    }
}
