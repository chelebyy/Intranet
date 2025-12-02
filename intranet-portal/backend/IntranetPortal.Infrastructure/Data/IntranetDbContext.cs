using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Infrastructure.Data;

/// <summary>
/// Main database context for the Intranet Portal application.
/// Implements multi-unit RBAC system with comprehensive audit logging.
/// Structurally compatible with IIntranetDbContext (wrapped in API layer).
/// </summary>
public class IntranetDbContext : DbContext
{
    public IntranetDbContext(DbContextOptions<IntranetDbContext> options)
        : base(options)
    {
    }

    #region DbSets - Core Entities

    /// <summary>
    /// Users table - Contains all system users with authentication details
    /// </summary>
    public DbSet<User> Users { get; set; } = null!;

    /// <summary>
    /// Birimler (Units/Departments) table
    /// </summary>
    public DbSet<Birim> Birimler { get; set; } = null!;

    /// <summary>
    /// Roles table - System roles (SistemAdmin, BirimAdmin, BirimEditor, BirimGoruntuleyen, SuperAdmin)
    /// </summary>
    public DbSet<Role> Roles { get; set; } = null!;

    /// <summary>
    /// Permissions table - Granular permissions (action.resource format)
    /// </summary>
    public DbSet<Permission> Permissions { get; set; } = null!;

    /// <summary>
    /// UserBirimRole junction table - Maps users to units with specific roles (CRITICAL for multi-unit support)
    /// </summary>
    public DbSet<UserBirimRole> UserBirimRoles { get; set; } = null!;

    /// <summary>
    /// RolePermission junction table - Maps roles to permissions
    /// </summary>
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    /// <summary>
    /// Audit logs - All critical operations tracking
    /// </summary>
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    /// <summary>
    /// Uploaded files metadata and polymorphic relationships
    /// </summary>
    public DbSet<UploadedFile> UploadedFiles { get; set; } = null!;

    /// <summary>
    /// System settings - Maintenance mode, file size limits, etc.
    /// </summary>
    public DbSet<SystemSettings> SystemSettings { get; set; } = null!;

    /// <summary>
    /// IP Restrictions - Whitelist/Blacklist IP management
    /// </summary>
    public DbSet<IPRestriction> IPRestrictions { get; set; } = null!;

    /// <summary>
    /// Unvanlar (Titles/Positions) table
    /// </summary>
    public DbSet<Unvan> Unvanlar { get; set; } = null!;

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations from Configurations folder
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IntranetDbContext).Assembly);

        // Configure PostgreSQL-specific settings
        ConfigurePostgresql(modelBuilder);
    }

    /// <summary>
    /// Configure PostgreSQL-specific conventions and settings
    /// </summary>
    private void ConfigurePostgresql(ModelBuilder modelBuilder)
    {
        // Use quote-delimited names for PostgreSQL compatibility (e.g., "User", "BirimID")
        // This prevents conflicts with PostgreSQL reserved keywords
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Table names are already set in individual configurations
            // This ensures consistency with ERD.md specifications
        }
    }

    /// <summary>
    /// Override SaveChanges to add automatic audit logging for critical entities
    /// </summary>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Future enhancement: Add automatic audit logging here
        // For now, audit logs are created explicitly in services
        return await base.SaveChangesAsync(cancellationToken);
    }
}
