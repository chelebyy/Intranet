using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using IntranetPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.API.Data;

/// <summary>
/// Adapter class that wraps IntranetDbContext to implement IIntranetDbContext
/// This avoids circular dependency between Application and Infrastructure layers
/// </summary>
public class IntranetDbContextAdapter : IIntranetDbContext
{
    private readonly IntranetDbContext _context;

    public IntranetDbContextAdapter(IntranetDbContext context)
    {
        _context = context;
    }

    public DbSet<User> Users => _context.Users;
    public DbSet<Birim> Birimler => _context.Birimler;
    public DbSet<Role> Roles => _context.Roles;
    public DbSet<Permission> Permissions => _context.Permissions;
    public DbSet<UserBirimRole> UserBirimRoles => _context.UserBirimRoles;
    public DbSet<RolePermission> RolePermissions => _context.RolePermissions;
    public DbSet<AuditLog> AuditLogs => _context.AuditLogs;
    public DbSet<UploadedFile> UploadedFiles => _context.UploadedFiles;
    public DbSet<SystemSettings> SystemSettings => _context.SystemSettings;

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
