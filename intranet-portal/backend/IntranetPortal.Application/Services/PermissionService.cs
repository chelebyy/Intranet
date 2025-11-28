using IntranetPortal.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace IntranetPortal.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IIntranetDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CacheKeyPrefix = "permissions_role_";

        public PermissionService(IIntranetDbContext context, IMemoryCache cache)
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

        private async Task<HashSet<string>> GetRolePermissionsAsync(int roleId)
        {
            var cacheKey = $"{CacheKeyPrefix}{roleId}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                // Set cache expiration (e.g., 1 hour)
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                entry.SlidingExpiration = TimeSpan.FromMinutes(20);

                // Query database
                var permissions = await _context.RolePermissions
                    .Where(rp => rp.RoleID == roleId)
                    .Select(rp => new { rp.Permission.Action, rp.Permission.Resource })
                    .ToListAsync();

                // Construct full permission strings "action.resource"
                var permissionSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var p in permissions)
                {
                    permissionSet.Add($"{p.Action}.{p.Resource}");
                }

                return permissionSet;
            }) ?? new HashSet<string>();
        }
    }
}
