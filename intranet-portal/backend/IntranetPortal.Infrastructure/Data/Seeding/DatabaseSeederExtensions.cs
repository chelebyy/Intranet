using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace IntranetPortal.Infrastructure.Data.Seeding;

/// <summary>
/// Extension methods for database seeding
/// </summary>
public static class DatabaseSeederExtensions
{
    /// <summary>
    /// Seed database with initial data
    /// Call this in Program.cs after app.Build()
    /// </summary>
    public static async Task<IHost> SeedDatabaseAsync(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var context = services.GetRequiredService<IntranetDbContext>();
            var logger = services.GetRequiredService<ILogger<DatabaseSeeder>>();

            // Ensure database is created and migrated
            await context.Database.MigrateAsync();

            // Run seeder
            var seeder = new DatabaseSeeder(context, logger);
            await seeder.SeedAsync();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<DatabaseSeeder>>();
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }

        return host;
    }
}
