using System.Security.Claims;

namespace IntranetPortal.API.Extensions
{
    /// <summary>
    /// Extension methods for ClaimsPrincipal to easily access custom JWT claims
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Gets the User ID from Claims ("userId")
        /// </summary>
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("userId");
            return claim != null && int.TryParse(claim.Value, out int id) ? id : 0;
        }

        /// <summary>
        /// Gets the User Sicil from Claims ("sicil")
        /// </summary>
        public static string GetSicil(this ClaimsPrincipal user)
        {
            return user.FindFirst("sicil")?.Value ?? string.Empty;
        }

        /// <summary>
        /// Gets the Active Birim ID from Claims ("birimId")
        /// Returns null if no birim is selected (e.g. during login/select-birim phase)
        /// </summary>
        public static int? GetBirimId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("birimId");
            return claim != null && int.TryParse(claim.Value, out int id) ? id : null;
        }

        /// <summary>
        /// Gets the Active Birim Name from Claims ("birimAdi")
        /// </summary>
        public static string? GetBirimAdi(this ClaimsPrincipal user)
        {
            return user.FindFirst("birimAdi")?.Value;
        }

        /// <summary>
        /// Gets the Active Role ID from Claims ("roleId")
        /// </summary>
        public static int? GetRoleId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("roleId");
            return claim != null && int.TryParse(claim.Value, out int id) ? id : null;
        }

        /// <summary>
        /// Gets the Active Role Name from Claims ("roleName")
        /// </summary>
        public static string? GetRoleName(this ClaimsPrincipal user)
        {
            return user.FindFirst("roleName")?.Value;
        }

        /// <summary>
        /// Checks if the current active role is "SistemAdmin" or "SuperAdmin"
        /// Used for bypassing unit-based filters
        /// </summary>
        public static bool IsSuperAdmin(this ClaimsPrincipal user)
        {
            var roleName = user.GetRoleName();
            return roleName == IntranetPortal.Domain.Constants.Roles.SuperAdmin || 
                   roleName == IntranetPortal.Domain.Constants.Roles.SistemAdmin;
        }
    }
}