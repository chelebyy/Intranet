using IntranetPortal.API.Attributes;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Roles;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly IPermissionService _permissionService;

    public RolesController(IRoleService roleService, IPermissionService permissionService)
    {
        _roleService = roleService;
        _permissionService = permissionService;
    }

    [HttpGet]
    [HasPermission(Permissions.ReadRole)]
    public async Task<ActionResult<ApiResponse<IEnumerable<RoleDto>>>> GetAll()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(ApiResponse<IEnumerable<RoleDto>>.Ok(roles));
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadRole)]
    public async Task<ActionResult<ApiResponse<RoleDto>>> GetById(int id)
    {
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null) return NotFound(ApiResponse<RoleDto>.Fail("Rol bulunamadı", "NOT_FOUND"));
        return Ok(ApiResponse<RoleDto>.Ok(role));
    }

    [HttpPost]
    [HasPermission(Permissions.CreateRole)]
    public async Task<ActionResult<ApiResponse<RoleDto>>> Create(CreateRoleDto createRoleDto)
    {
        try
        {
            var role = await _roleService.CreateRoleAsync(createRoleDto);
            return CreatedAtAction(nameof(GetById), new { id = role.RoleID }, ApiResponse<RoleDto>.Ok(role));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<RoleDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.UpdateRole)]
    public async Task<ActionResult<ApiResponse<RoleDto>>> Update(int id, UpdateRoleDto updateRoleDto)
    {
        try
        {
            var role = await _roleService.UpdateRoleAsync(id, updateRoleDto);
            if (role == null) return NotFound(ApiResponse<RoleDto>.Fail("Rol bulunamadı", "NOT_FOUND"));
            return Ok(ApiResponse<RoleDto>.Ok(role));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<RoleDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.DeleteRole)]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var result = await _roleService.DeleteRoleAsync(id);
            if (!result) return NotFound(ApiResponse<bool>.Fail("Rol bulunamadı", "NOT_FOUND"));
            return Ok(ApiResponse<bool>.Ok(true, "Rol silindi"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<bool>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpGet("{id}/permissions")]
    [HasPermission(Permissions.ReadRole)] // Changed to ReadRole to match viewing permissions
    public async Task<ActionResult<ApiResponse<IEnumerable<Application.DTOs.Permissions.PermissionDto>>>> GetPermissions(int id)
    {
        // Verify role exists
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null) return NotFound(ApiResponse<IEnumerable<Application.DTOs.Permissions.PermissionDto>>.Fail("Rol bulunamadı", "NOT_FOUND"));

        var permissions = await _permissionService.GetPermissionsByRoleIdAsync(id);

        return Ok(ApiResponse<IEnumerable<Application.DTOs.Permissions.PermissionDto>>.Ok(permissions));
    }

    [HttpPost("{id}/permissions")]
    [HasPermission(Permissions.ManagePermissions)]
    public async Task<ActionResult<ApiResponse<bool>>> UpdatePermissions(int id, [FromBody] Application.DTOs.Permissions.AssignPermissionsDto assignPermissionsDto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<bool>.Fail("Geçersiz veri", "VALIDATION_ERROR"));

        try
        {
            await _permissionService.UpdateRolePermissionsAsync(id, assignPermissionsDto.PermissionIds);
            return Ok(ApiResponse<bool>.Ok(true, "Permissions updated successfully."));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<bool>.Fail("Rol bulunamadı", "NOT_FOUND"));
        }
    }
}
