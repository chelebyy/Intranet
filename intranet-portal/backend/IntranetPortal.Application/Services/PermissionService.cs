using IntranetPortal.Application.DTOs.Permissions;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

using IntranetPortal.Infrastructure.Data;

namespace IntranetPortal.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IntranetDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CacheKeyPrefix = "permissions_role_";

        public PermissionService(IntranetDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<bool> HasPermissionAsync(int roleId, string permission)
        {
            if (string.IsNullOrWhiteSpace(permission))
                return false;

            var rolePermissions = await GetRolePermissionsAsync(roleId);
            return rolePermissions.Contains(permission);
        }

        public Task InvalidateCacheAsync(int roleId)
        {
            _cache.Remove($"{CacheKeyPrefix}{roleId}");
            return Task.CompletedTask;
        }

        public async Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync()
        {
            return await _context.Permissions
                .Select(p => new PermissionDto
                {
                    PermissionID = p.PermissionID,
                    Action = p.Action,
                    Resource = p.Resource,
                    Description = p.Description
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PermissionDto>> GetPermissionsByRoleIdAsync(int roleId)
        {
            return await _context.RolePermissions
                .Where(rp => rp.RoleID == roleId)
                .Select(rp => new PermissionDto
                {
                    PermissionID = rp.Permission.PermissionID,
                    Action = rp.Permission.Action,
                    Resource = rp.Permission.Resource,
                    Description = rp.Permission.Description
                })
                .ToListAsync();
        }

        public async Task UpdateRolePermissionsAsync(int roleId, List<int> permissionIds)
        {
            var role = await _context.Roles.FindAsync(roleId);
            if (role == null)
            {
                throw new KeyNotFoundException($"Role with ID {roleId} not found.");
            }

            // Get existing permissions
            var existingRolePermissions = await _context.RolePermissions
                .Where(rp => rp.RoleID == roleId)
                .ToListAsync();

            // Determine permissions to remove
            var permissionsToRemove = existingRolePermissions
                .Where(rp => !permissionIds.Contains(rp.PermissionID))
                .ToList();

            if (permissionsToRemove.Any())
            {
                _context.RolePermissions.RemoveRange(permissionsToRemove);
            }

            // Determine permissions to add
            var existingPermissionIds = existingRolePermissions.Select(rp => rp.PermissionID).ToList();
            var newPermissionIds = permissionIds.Except(existingPermissionIds).ToList();

            if (newPermissionIds.Any())
            {
                // Verify permissions exist
                var validPermissions = await _context.Permissions
                    .Where(p => newPermissionIds.Contains(p.PermissionID))
                    .Select(p => p.PermissionID)
                    .ToListAsync();

                var permissionsToAdd = validPermissions.Select(pid => new RolePermission
                {
                    RoleID = roleId,
                    PermissionID = pid,
                    GrantedAt = DateTime.UtcNow
                });

                _context.RolePermissions.AddRange(permissionsToAdd);
            }

            await _context.SaveChangesAsync();

            // Invalidate cache
            await InvalidateCacheAsync(roleId);
        }

        private async Task<HashSet<string>> GetRolePermissionsAsync(int roleId)
        {
            var cacheKey = $"{CacheKeyPrefix}{roleId}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                // Set cache expiration (e.g., 1 hour)
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                entry.SlidingExpiration = TimeSpan.FromMinutes(20);

                // Query database using Raw SQL to bypass EF Core mapping issues
                var permissions = await _context.Database.SqlQueryRaw<PermissionResult>(
                    @"SELECT p.""Action"", p.""Resource""
                      FROM ""RolePermission"" rp
                      JOIN ""Permission"" p ON rp.""PermissionID"" = p.""PermissionID""
                      WHERE rp.""RoleID"" = {0}", roleId)
                    .ToListAsync();

                Console.WriteLine($"PermissionService: Found {permissions.Count} permissions for RoleID {roleId} via Raw SQL.");

                // Construct full permission strings "action.resource"
                var permissionSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var p in permissions)
                {
                    permissionSet.Add($"{p.Action}.{p.Resource}");
                }

                return permissionSet;
            }) ?? new HashSet<string>();
        }

        // Helper class for raw SQL result
        private class PermissionResult
        {
            public string Action { get; set; } = string.Empty;
            public string Resource { get; set; } = string.Empty;
        }
    }
}
