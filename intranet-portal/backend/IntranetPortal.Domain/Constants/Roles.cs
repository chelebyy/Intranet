namespace IntranetPortal.Domain.Constants
{
    /// <summary>
    /// Default system role name constants
    /// Matches roles defined in ERD.md
    /// </summary>
    public static class Roles
    {
        /// <summary>
        /// System administrator - full system access
        /// </summary>
        public const string SistemAdmin = "SistemAdmin";

        /// <summary>
        /// Unit/Department administrator
        /// </summary>
        public const string BirimAdmin = "BirimAdmin";

        /// <summary>
        /// Unit editor - can create and update content
        /// </summary>
        public const string BirimEditor = "BirimEditor";

        /// <summary>
        /// Unit viewer - read-only access
        /// </summary>
        public const string BirimGoruntuleyen = "BirimGoruntuleyen";

        /// <summary>
        /// Super administrator - technical team with system maintenance access
        /// </summary>
        public const string SuperAdmin = "SuperAdmin";
    }
}
