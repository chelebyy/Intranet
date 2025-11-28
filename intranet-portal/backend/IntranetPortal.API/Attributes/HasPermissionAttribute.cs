using IntranetPortal.API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Attributes
{
    /// <summary>
    /// Authorizes a request based on a required permission.
    /// Uses PermissionAuthorizationFilter to check if the user's role has the permission.
    /// </summary>
    public class HasPermissionAttribute : TypeFilterAttribute
    {
        /// <summary>
        /// Initializes a new instance of the HasPermissionAttribute class.
        /// </summary>
        /// <param name="permission">The required permission (e.g., "create.user").</param>
        public HasPermissionAttribute(string permission) : base(typeof(PermissionAuthorizationFilter))
        {
            Arguments = new object[] { permission };
        }
    }
}
