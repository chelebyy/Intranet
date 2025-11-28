using IntranetPortal.API.Attributes;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PermissionsController : ControllerBase
{
    private readonly IPermissionService _permissionService;

    public PermissionsController(IPermissionService permissionService)
    {
        _permissionService = permissionService;
    }

    [HttpGet]
    [HasPermission(Permissions.ManagePermissions)]
    public async Task<IActionResult> GetAll()
    {
        var permissions = await _permissionService.GetAllPermissionsAsync();
        return Ok(permissions);
    }
}
