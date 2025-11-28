using System.Security.Claims;

namespace IntranetPortal.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Gets the User ID from Claims
        /// </summary>
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            return idClaim != null && int.TryParse(idClaim.Value, out int id) ? id : 0;
        }

        /// <summary>
        /// Gets the User Sicil from Claims
        /// </summary>
        public static string? GetUserSicil(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        /// <summary>
        /// Gets the User Role Name from Claims
        /// </summary>
        public static string? GetUserRole(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role)?.Value;
        }

        /// <summary>
        /// Checks if user has a specific role
        /// </summary>
        public static bool HasRole(this ClaimsPrincipal user, string roleName)
        {
            return user.IsInRole(roleName);
        }
    }
}
