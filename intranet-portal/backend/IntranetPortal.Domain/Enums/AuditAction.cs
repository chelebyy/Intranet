namespace IntranetPortal.Domain.Enums
{
    /// <summary>
    /// Common audit log action types
    /// </summary>
    public enum AuditAction
    {
        // Authentication
        Login,
        Logout,
        LoginFailed,
        TokenRefresh,

        // User Management
        CreateUser,
        UpdateUser,
        DeleteUser,
        ActivateUser,
        DeactivateUser,

        // Role & Permission Management
        CreateRole,
        UpdateRole,
        DeleteRole,
        AssignPermission,
        RevokePermission,
        AssignUserRole,
        RevokeUserRole,

        // Birim Management
        CreateBirim,
        UpdateBirim,
        DeleteBirim,

        // Content Management
        CreateAnnouncement,
        UpdateAnnouncement,
        DeleteAnnouncement,

        // File Operations
        UploadFile,
        DownloadFile,
        DeleteFile,

        // System Settings
        UpdateSystemSetting,
        EnableMaintenanceMode,
        DisableMaintenanceMode,

        // Export Operations
        ExportUsers,
        ExportAuditLog,
        ExportBirimData,

        // Security Events
        UnauthorizedAccess,
        IPBlocked,
        RateLimitExceeded
    }
}
