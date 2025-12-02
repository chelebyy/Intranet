using IntranetPortal.API.Attributes;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IntranetPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IPRestrictionsController : ControllerBase
{
    private readonly IIPRestrictionService _ipRestrictionService;

    public IPRestrictionsController(IIPRestrictionService ipRestrictionService)
    {
        _ipRestrictionService = ipRestrictionService;
    }

    [HttpGet]
    [HasPermission(Permissions.ReadSystem)]
    public async Task<IActionResult> GetAll()
    {
        var restrictions = await _ipRestrictionService.GetAllAsync();
        return Ok(new { success = true, data = restrictions });
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadSystem)]
    public async Task<IActionResult> GetById(int id)
    {
        var restriction = await _ipRestrictionService.GetByIdAsync(id);
        if (restriction == null)
            return NotFound(new { success = false, message = "IP kuralı bulunamadı" });

        return Ok(new { success = true, data = restriction });
    }

    [HttpPost]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<IActionResult> Create([FromBody] CreateIPRestrictionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Validasyon hatası" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? createdBy = userId != null ? int.Parse(userId) : null;

        var result = await _ipRestrictionService.CreateAsync(dto, createdBy);
        return CreatedAtAction(nameof(GetById), new { id = result.ID }, new { success = true, data = result });
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateIPRestrictionDto dto)
    {
        var result = await _ipRestrictionService.UpdateAsync(id, dto);
        if (result == null)
            return NotFound(new { success = false, message = "IP kuralı bulunamadı" });

        return Ok(new { success = true, data = result });
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.ManageMaintenance)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _ipRestrictionService.DeleteAsync(id);
        if (!result)
            return NotFound(new { success = false, message = "IP kuralı bulunamadı" });

        return Ok(new { success = true, message = "IP kuralı silindi" });
    }

    [HttpGet("check/{ip}")]
    [HasPermission(Permissions.ReadSystem)]
    public async Task<IActionResult> CheckIP(string ip)
    {
        var isAllowed = await _ipRestrictionService.IsIPAllowedAsync(ip);
        return Ok(new { success = true, data = new { ip, isAllowed } });
    }
}
