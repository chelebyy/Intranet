namespace IntranetPortal.Domain.Constants
{
    /// <summary>
    /// Centralized permission constants
    /// Follows "action.resource" naming pattern
    /// Matches permissions defined in ERD.md
    /// </summary>
    public static class Permissions
    {
        // User Management
        public const string CreateUser = "create.user";
        public const string ReadUser = "read.user";
        public const string UpdateUser = "update.user";
        public const string DeleteUser = "delete.user";
        public const string ExportUser = "export.user";

        // Announcement Management
        public const string CreateAnnouncement = "create.announcement";
        public const string ReadAnnouncement = "read.announcement";
        public const string UpdateAnnouncement = "update.announcement";
        public const string DeleteAnnouncement = "delete.announcement";

        // Audit Log
        public const string ReadAuditLog = "read.auditlog";
        public const string ExportAuditLog = "export.auditlog";

        // Birim Management
        public const string ManageBirim = "manage.birim";
        public const string CreateBirim = "create.birim";
        public const string ReadBirim = "read.birim";
        public const string UpdateBirim = "update.birim";
        public const string DeleteBirim = "delete.birim";
        public const string ExportBirim = "export.birim";

        // File Management (PRD FR-33 to FR-38)
        public const string UploadFile = "upload.file";
        public const string ReadFile = "read.file";
        public const string DeleteFile = "delete.file";

        // System Management (PRD FR-44 to FR-47)
        public const string ManageMaintenance = "manage.maintenance";
        public const string ReadSystem = "read.system";

        // Role & Permission Management (typically SuperAdmin only)
        public const string ManageRoles = "manage.roles";
        public const string CreateRole = "create.role";
        public const string ReadRole = "read.role";
        public const string UpdateRole = "update.role";
        public const string DeleteRole = "delete.role";
        public const string ManagePermissions = "manage.permissions";
    }
}
