using System.Net;
using System.Security.Claims;
using IntranetPortal.Domain.Constants;
using IntranetPortal.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection; // Important for creating scope

namespace IntranetPortal.Infrastructure.Middleware;

public class MaintenanceMiddleware
{
    private readonly RequestDelegate _next;

    public MaintenanceMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 1. Skip checks for Login and Maintenance endpoints (allow admins to login and disable mode)
        var path = context.Request.Path.Value?.ToLower();
        if (path != null && (
            path.StartsWith("/api/auth/login") || 
            path.StartsWith("/api/maintenance") ||
            path.StartsWith("/swagger") || // Documentation
            path.StartsWith("/health")     // Health checks
           ))
        {
            await _next(context);
            return;
        }

        // 2. Check Maintenance Mode Setting
        // Need to create a scope because DbContext is Scoped, but Middleware is Singleton
        using (var scope = context.RequestServices.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<IntranetDbContext>();
            var maintenanceSetting = await dbContext.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeIsEnabled);

            if (maintenanceSetting != null && bool.TryParse(maintenanceSetting.SettingValue, out var isEnabled) && isEnabled)
            {
                // 3. Mode is Active. Check if user is Admin.
                // We need to verify the user from the context.
                // Note: AuthenticationMiddleware runs before this, so User should be populated if token is valid.
                
                var user = context.User;
                if (user.Identity?.IsAuthenticated == true && user.IsInRole("Admin"))
                {
                    // Admin can proceed
                    await _next(context);
                    return;
                }

                // 4. User is not admin or not logged in -> Block
                context.Response.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                context.Response.ContentType = "application/json";
                
                var messageSetting = await dbContext.SystemSettings
                    .FirstOrDefaultAsync(s => s.SettingKey == SystemSettingKeys.MaintenanceModeMessage);
                
                var message = messageSetting?.SettingValue ?? "Sistem şu anda bakım modundadır. Lütfen daha sonra tekrar deneyiniz.";

                var response = new 
                {
                    success = false,
                    message = message,
                    error = "MaintenanceMode"
                };

                await context.Response.WriteAsJsonAsync(response);
                return;
            }
        }

        // Mode not active, proceed
        await _next(context);
    }
}
