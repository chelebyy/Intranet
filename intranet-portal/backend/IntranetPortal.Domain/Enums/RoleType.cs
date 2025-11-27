namespace IntranetPortal.Domain.Enums
{
    /// <summary>
    /// Enum for default system roles
    /// Matches the roles defined in ERD.md
    /// </summary>
    public enum RoleType
    {
        /// <summary>
        /// System administrator with full system access
        /// </summary>
        SistemAdmin = 1,

        /// <summary>
        /// Unit/Department administrator
        /// </summary>
        BirimAdmin = 2,

        /// <summary>
        /// Unit editor - can create and update content
        /// </summary>
        BirimEditor = 3,

        /// <summary>
        /// Unit viewer - read-only access
        /// </summary>
        BirimGoruntuleyen = 4,

        /// <summary>
        /// Super administrator - technical team with system maintenance access
        /// </summary>
        SuperAdmin = 5
    }
}
