using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Roles;

namespace IntranetPortal.Application.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<RoleDto>> GetAllRolesAsync();
    Task<RoleDto?> GetRoleByIdAsync(int id);
    Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto);
    Task<RoleDto?> UpdateRoleAsync(int id, UpdateRoleDto updateRoleDto);
    Task<bool> DeleteRoleAsync(int id);
}
