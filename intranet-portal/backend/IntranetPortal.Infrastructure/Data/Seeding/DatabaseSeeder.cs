using IntranetPortal.Domain.Constants;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace IntranetPortal.Infrastructure.Data.Seeding;

/// <summary>
/// Database seed data manager
/// Seeds initial roles, permissions, default birim, and SuperAdmin user
/// Reference: IMPLEMENTATION_ROADMAP.md - Faz 1
/// </summary>
public class DatabaseSeeder
{
    private readonly IntranetDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(IntranetDbContext context, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seed all initial data
    /// </summary>
    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting database seeding...");

            // Seed in order of dependencies
            await SeedRolesAsync();
            await _context.SaveChangesAsync(); // Save roles before using them

            await SeedPermissionsAsync();
            await _context.SaveChangesAsync(); // Save permissions before using them

            await SeedRolePermissionsAsync();
            await _context.SaveChangesAsync(); // Save role-permission mappings

            await SeedDefaultBirimAsync();
            await _context.SaveChangesAsync(); // Save default birim

            await SeedSuperAdminUserAsync();
            await _context.SaveChangesAsync(); // Save super admin user

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while seeding database");
            throw;
        }
    }

    /// <summary>
    /// Seed system roles
    /// Reference: ERD.md Section 5.3, CLAUDE.md - Core System Flows
    /// </summary>
    private async Task SeedRolesAsync()
    {
        if (await _context.Roles.AnyAsync())
        {
            _logger.LogInformation("Roles already exist, skipping...");
            return;
        }

        var roles = new List<Role>
        {
            new Role
            {
                RoleAdi = Domain.Constants.Roles.SuperAdmin,
                Aciklama = "Sistem genelinde tüm yetkilere sahip süper yönetici",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                RoleAdi = Domain.Constants.Roles.SistemAdmin,
                Aciklama = "Sistem yöneticisi - tüm birimleri yönetebilir",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                RoleAdi = Domain.Constants.Roles.BirimAdmin,
                Aciklama = "Birim yöneticisi - kendi biriminde tam yetki",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                RoleAdi = Domain.Constants.Roles.BirimEditor,
                Aciklama = "Birim editörü - içerik oluşturabilir ve düzenleyebilir",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                RoleAdi = Domain.Constants.Roles.BirimGoruntuleyen,
                Aciklama = "Birim görüntüleyeni - sadece okuma yetkisi",
                CreatedAt = DateTime.UtcNow
            }
        };

        await _context.Roles.AddRangeAsync(roles);
        _logger.LogInformation("Seeded {Count} roles", roles.Count);
    }

    /// <summary>
    /// Seed system permissions
    /// Reference: ERD.md Section 5.4
    /// </summary>
    private async Task SeedPermissionsAsync()
    {
        if (await _context.Permissions.AnyAsync())
        {
            _logger.LogInformation("Permissions already exist, skipping...");
            return;
        }

        var permissions = new List<Permission>
        {
            // User Management
            new Permission { Action = "create", Resource = "user", Description = "Kullanıcı oluşturabilir" },
            new Permission { Action = "read", Resource = "user", Description = "Kullanıcıları görüntüleyebilir" },
            new Permission { Action = "update", Resource = "user", Description = "Kullanıcı bilgilerini güncelleyebilir" },
            new Permission { Action = "delete", Resource = "user", Description = "Kullanıcı silebilir" },
            new Permission { Action = "manage", Resource = "user", Description = "Tüm kullanıcı işlemlerini yapabilir" },

            // Birim Management
            new Permission { Action = "create", Resource = "birim", Description = "Birim oluşturabilir" },
            new Permission { Action = "read", Resource = "birim", Description = "Birimleri görüntüleyebilir" },
            new Permission { Action = "update", Resource = "birim", Description = "Birim bilgilerini güncelleyebilir" },
            new Permission { Action = "delete", Resource = "birim", Description = "Birim silebilir" },
            new Permission { Action = "manage", Resource = "birim", Description = "Tüm birim işlemlerini yapabilir" },

            // Role Management
            new Permission { Action = "create", Resource = "role", Description = "Rol oluşturabilir" },
            new Permission { Action = "read", Resource = "role", Description = "Rolleri görüntüleyebilir" },
            new Permission { Action = "update", Resource = "role", Description = "Rol bilgilerini güncelleyebilir" },
            new Permission { Action = "delete", Resource = "role", Description = "Rol silebilir" },
            new Permission { Action = "manage", Resource = "role", Description = "Tüm rol işlemlerini yapabilir" },

            // Permission Management
            new Permission { Action = "read", Resource = "permission", Description = "Yetkileri görüntüleyebilir" },
            new Permission { Action = "assign", Resource = "permission", Description = "Yetki atayabilir" },
            new Permission { Action = "manage", Resource = "permission", Description = "Tüm yetki işlemlerini yapabilir" },

            // Audit Log
            new Permission { Action = "read", Resource = "auditlog", Description = "Denetim kayıtlarını görüntüleyebilir" },
            new Permission { Action = "export", Resource = "auditlog", Description = "Denetim kayıtlarını dışa aktarabilir" },

            // System Settings
            new Permission { Action = "read", Resource = "system", Description = "Sistem ayarlarını görüntüleyebilir" },
            new Permission { Action = "update", Resource = "system", Description = "Sistem ayarlarını güncelleyebilir" },
            new Permission { Action = "manage", Resource = "system", Description = "Tüm sistem işlemlerini yapabilir" },

            // File Management
            new Permission { Action = "upload", Resource = "file", Description = "Dosya yükleyebilir" },
            new Permission { Action = "download", Resource = "file", Description = "Dosya indirebilir" },
            new Permission { Action = "delete", Resource = "file", Description = "Dosya silebilir" },

            // Dashboard
            new Permission { Action = "view", Resource = "dashboard", Description = "Dashboard'u görüntüleyebilir" },
        };

        await _context.Permissions.AddRangeAsync(permissions);
        _logger.LogInformation("Seeded {Count} permissions", permissions.Count);
    }

    /// <summary>
    /// Assign permissions to roles
    /// Reference: CLAUDE.md - RBAC Implementation
    /// </summary>
    private async Task SeedRolePermissionsAsync()
    {
        if (await _context.RolePermissions.AnyAsync())
        {
            _logger.LogInformation("Role permissions already assigned, skipping...");
            return;
        }

        var roles = await _context.Roles.ToListAsync();
        var permissions = await _context.Permissions.ToListAsync();

        var rolePermissions = new List<RolePermission>();

        // SuperAdmin - ALL permissions
        var superAdminRole = roles.First(r => r.RoleAdi == Domain.Constants.Roles.SuperAdmin);
        rolePermissions.AddRange(permissions.Select(p => new RolePermission
        {
            RoleID = superAdminRole.RoleID,
            PermissionID = p.PermissionID,
            GrantedAt = DateTime.UtcNow
        }));

        // SistemAdmin - All except system.manage
        var sistemAdminRole = roles.First(r => r.RoleAdi == Domain.Constants.Roles.SistemAdmin);
        var sistemAdminPermissions = permissions.Where(p =>
            !(p.Action == "manage" && p.Resource == "system")).ToList();
        rolePermissions.AddRange(sistemAdminPermissions.Select(p => new RolePermission
        {
            RoleID = sistemAdminRole.RoleID,
            PermissionID = p.PermissionID,
            GrantedAt = DateTime.UtcNow
        }));

        // BirimAdmin - Birim and user management within their birim
        var birimAdminRole = roles.First(r => r.RoleAdi == Domain.Constants.Roles.BirimAdmin);
        var birimAdminPermissions = permissions.Where(p =>
            p.Resource == "user" || p.Resource == "role" || p.Resource == "file" ||
            (p.Resource == "auditlog" && p.Action == "read")).ToList();
        rolePermissions.AddRange(birimAdminPermissions.Select(p => new RolePermission
        {
            RoleID = birimAdminRole.RoleID,
            PermissionID = p.PermissionID,
            GrantedAt = DateTime.UtcNow
        }));

        // BirimEditor - Create, read, update (no delete)
        var birimEditorRole = roles.First(r => r.RoleAdi == Domain.Constants.Roles.BirimEditor);
        var birimEditorPermissions = permissions.Where(p =>
            (p.Action == "create" || p.Action == "read" || p.Action == "update" ||
             p.Action == "upload" || p.Action == "download") &&
            (p.Resource == "user" || p.Resource == "file")).ToList();
        rolePermissions.AddRange(birimEditorPermissions.Select(p => new RolePermission
        {
            RoleID = birimEditorRole.RoleID,
            PermissionID = p.PermissionID,
            GrantedAt = DateTime.UtcNow
        }));

        // BirimGoruntuleyen - Read only
        var birimGoruntUleyenRole = roles.First(r => r.RoleAdi == Domain.Constants.Roles.BirimGoruntuleyen);
        var birimGoruntUleyenPermissions = permissions.Where(p =>
            p.Action == "read" || p.Action == "download").ToList();
        rolePermissions.AddRange(birimGoruntUleyenPermissions.Select(p => new RolePermission
        {
            RoleID = birimGoruntUleyenRole.RoleID,
            PermissionID = p.PermissionID,
            GrantedAt = DateTime.UtcNow
        }));

        await _context.RolePermissions.AddRangeAsync(rolePermissions);
        _logger.LogInformation("Assigned permissions to {Count} roles", roles.Count);
    }

    /// <summary>
    /// Create default "Sistem Yönetimi" birim
    /// </summary>
    private async Task SeedDefaultBirimAsync()
    {
        if (await _context.Birimler.AnyAsync())
        {
            _logger.LogInformation("Birimler already exist, skipping...");
            return;
        }

        var sistemBirim = new Birim
        {
            BirimAdi = "Sistem Yönetimi",
            Aciklama = "Sistem yöneticileri için varsayılan birim",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Birimler.AddAsync(sistemBirim);
        _logger.LogInformation("Created default birim: Sistem Yönetimi");
    }

    /// <summary>
    /// Create SuperAdmin user
    /// Default credentials: sicil=00001 / Admin123!
    /// Reference: IMPLEMENTATION_ROADMAP.md - Faz 1, Step 1.4
    /// </summary>
    private async Task SeedSuperAdminUserAsync()
    {
        if (await _context.Users.AnyAsync())
        {
            _logger.LogInformation("Users already exist, skipping...");
            return;
        }

        // Password: Admin123! (hashed with BCrypt work factor 12)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", workFactor: 12);

        var superAdminUser = new User
        {
            Ad = "Süper",
            Soyad = "Yönetici",
            Sicil = "00001",
            SifreHash = passwordHash,
            Unvan = "Sistem Yöneticisi",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(superAdminUser);
        await _context.SaveChangesAsync(); // Save to get UserID

        // Assign SuperAdmin role in Sistem Yönetimi birim
        var superAdminRole = await _context.Roles.FirstAsync(r => r.RoleAdi == Domain.Constants.Roles.SuperAdmin);
        var sistemBirim = await _context.Birimler.FirstAsync(b => b.BirimAdi == "Sistem Yönetimi");

        var userBirimRole = new UserBirimRole
        {
            UserID = superAdminUser.UserID,
            BirimID = sistemBirim.BirimID,
            RoleID = superAdminRole.RoleID,
            AssignedAt = DateTime.UtcNow
        };

        await _context.UserBirimRoles.AddAsync(userBirimRole);
        _logger.LogInformation("Created SuperAdmin user: Sicil={Sicil}", superAdminUser.Sicil);
    }
}
