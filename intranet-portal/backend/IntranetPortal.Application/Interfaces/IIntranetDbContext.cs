using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Interfaces;

/// <summary>
/// Database context interface for Application layer
/// This provides necessary DbSet access without tight coupling to Infrastructure
/// </summary>
public interface IIntranetDbContext
{
    // DbSets
    DbSet<User> Users { get; }
    DbSet<Birim> Birimler { get; }
    DbSet<Role> Roles { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<UserBirimRole> UserBirimRoles { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<UploadedFile> UploadedFiles { get; }
    DbSet<SystemSettings> SystemSettings { get; }
    DbSet<IPRestriction> IPRestrictions { get; }

    // Methods
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
