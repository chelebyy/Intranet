using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Roles;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services;

public class RoleService : IRoleService
{
    private readonly IIntranetDbContext _context;

    public RoleService(IIntranetDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
    {
        return await _context.Roles
            .Select(r => new RoleDto
            {
                RoleID = r.RoleID,
                RoleName = r.RoleAdi,
                Description = r.Aciklama
            })
            .ToListAsync();
    }

    public async Task<RoleDto?> GetRoleByIdAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return null;

        return new RoleDto
        {
            RoleID = role.RoleID,
            RoleName = role.RoleAdi,
            Description = role.Aciklama
        };
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto)
    {
        if (await _context.Roles.AnyAsync(r => r.RoleAdi == createRoleDto.RoleAdi))
        {
            throw new InvalidOperationException($"Role with name '{createRoleDto.RoleAdi}' already exists.");
        }

        var role = new Role
        {
            RoleAdi = createRoleDto.RoleAdi,
            Aciklama = createRoleDto.Aciklama,
            CreatedAt = DateTime.UtcNow
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return new RoleDto
        {
            RoleID = role.RoleID,
            RoleName = role.RoleAdi,
            Description = role.Aciklama
        };
    }

    public async Task<RoleDto?> UpdateRoleAsync(int id, UpdateRoleDto updateRoleDto)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return null;

        if (role.RoleAdi != updateRoleDto.RoleAdi && await _context.Roles.AnyAsync(r => r.RoleAdi == updateRoleDto.RoleAdi))
        {
            throw new InvalidOperationException($"Role with name '{updateRoleDto.RoleAdi}' already exists.");
        }

        role.RoleAdi = updateRoleDto.RoleAdi;
        role.Aciklama = updateRoleDto.Aciklama;
        
        await _context.SaveChangesAsync();

        return new RoleDto
        {
            RoleID = role.RoleID,
            RoleName = role.RoleAdi,
            Description = role.Aciklama
        };
    }

    public async Task<bool> DeleteRoleAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return false;

        // Check if role is assigned to any users
        bool isAssigned = await _context.UserBirimRoles.AnyAsync(ubr => ubr.RoleID == id);
        if (isAssigned)
        {
             throw new InvalidOperationException("Cannot delete role because it is assigned to users.");
        }

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return true;
    }
}
