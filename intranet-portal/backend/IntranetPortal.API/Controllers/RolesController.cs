using IntranetPortal.API.Attributes;
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

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    [HasPermission(Permissions.ReadRole)]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _roleService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadRole)]
    public async Task<IActionResult> GetById(int id)
    {
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null) return NotFound();
        return Ok(role);
    }

    [HttpPost]
    [HasPermission(Permissions.CreateRole)]
    public async Task<IActionResult> Create(CreateRoleDto createRoleDto)
    {
        try
        {
            var role = await _roleService.CreateRoleAsync(createRoleDto);
            return CreatedAtAction(nameof(GetById), new { id = role.RoleID }, role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.UpdateRole)]
    public async Task<IActionResult> Update(int id, UpdateRoleDto updateRoleDto)
    {
        try
        {
            var role = await _roleService.UpdateRoleAsync(id, updateRoleDto);
            if (role == null) return NotFound();
            return Ok(role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.DeleteRole)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _roleService.DeleteRoleAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/permissions")]
    [HasPermission(Permissions.ManagePermissions)]
    public async Task<IActionResult> GetPermissions(int id)
    {
        // Verify role exists
        var role = await _roleService.GetRoleByIdAsync(id);
        if (role == null) return NotFound();

        // We need to inject IPermissionService for this
        // This is a quick fix, ideally inject in constructor
        var permissionService = HttpContext.RequestServices.GetRequiredService<IPermissionService>();
        var permissions = await permissionService.GetPermissionsByRoleIdAsync(id);
        
        return Ok(permissions);
    }

    [HttpPost("{id}/permissions")]
    [HasPermission(Permissions.ManagePermissions)]
    public async Task<IActionResult> UpdatePermissions(int id, [FromBody] Application.DTOs.Permissions.AssignPermissionsDto assignPermissionsDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var permissionService = HttpContext.RequestServices.GetRequiredService<IPermissionService>();
            await permissionService.UpdateRolePermissionsAsync(id, assignPermissionsDto.PermissionIds);
            return Ok(new { message = "Permissions updated successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
