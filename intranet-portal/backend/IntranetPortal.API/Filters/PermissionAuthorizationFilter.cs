using System.Security.Claims;
using IntranetPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace IntranetPortal.API.Filters
{
    /// <summary>
    /// Filter that checks if the current user has the required permission.
    /// </summary>
    public class PermissionAuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly string _requiredPermission;
        private readonly IPermissionService _permissionService;
        private readonly IJwtTokenService _jwtTokenService;

        public PermissionAuthorizationFilter(string requiredPermission, IPermissionService permissionService, IJwtTokenService jwtTokenService)
        {
            _requiredPermission = requiredPermission;
            _permissionService = permissionService;
            _jwtTokenService = jwtTokenService;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // 1. Check if user is authenticated
            if (context.HttpContext.User.Identity?.IsAuthenticated != true)
            {
                context.Result = new ChallengeResult();
                return;
            }

            // 2. Get user's role from claims
            var roleId = _jwtTokenService.GetRoleIdFromClaims(context.HttpContext.User);
            if (!roleId.HasValue)
            {
                // Authenticated but no role? Should not happen with valid token.
                context.Result = new ForbidResult();
                return;
            }

            // 2.5. SuperAdmin bypass - SuperAdmin has ALL permissions
            var roleName = context.HttpContext.User.FindFirst("roleName")?.Value;
            if (roleName == IntranetPortal.Domain.Constants.Roles.SuperAdmin)
            {
                return; // SuperAdmin is allowed to do anything
            }

            // 3. Check if role has the permission
            var hasPermission = await _permissionService.HasPermissionAsync(roleId.Value, _requiredPermission);
            if (!hasPermission)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
