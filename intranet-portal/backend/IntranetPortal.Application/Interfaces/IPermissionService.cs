using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntranetPortal.Application.Interfaces
{
    public interface IPermissionService
    {
        /// <summary>
        /// Checks if a role has a specific permission.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="permission">The permission string (e.g., "create.user").</param>
        /// <returns>True if the role has the permission, otherwise false.</returns>
        Task<bool> HasPermissionAsync(int roleId, string permission);

        /// <summary>
        /// Invalidates the permission cache for a specific role.
        /// Should be called when role permissions are updated.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        Task InvalidateCacheAsync(int roleId);
    }
}
