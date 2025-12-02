using IntranetPortal.API.Attributes;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Unvans;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UnvanlarController : ControllerBase
{
    private readonly IUnvanService _unvanService;

    public UnvanlarController(IUnvanService unvanService)
    {
        _unvanService = unvanService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<UnvanDto>>>> GetAll()
    {
        var unvanlar = await _unvanService.GetAllUnvansAsync();
        return Ok(ApiResponse<IEnumerable<UnvanDto>>.Ok(unvanlar));
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadUnvan)]
    public async Task<ActionResult<ApiResponse<UnvanDto>>> GetById(int id)
    {
        var unvan = await _unvanService.GetUnvanByIdAsync(id);
        if (unvan == null) return NotFound(ApiResponse<UnvanDto>.Fail("Ünvan bulunamadı", "NOT_FOUND"));
        return Ok(ApiResponse<UnvanDto>.Ok(unvan));
    }

    [HttpPost]
    [HasPermission(Permissions.CreateUnvan)]
    public async Task<ActionResult<ApiResponse<UnvanDto>>> Create(CreateUnvanDto createUnvanDto)
    {
        try
        {
            var unvan = await _unvanService.CreateUnvanAsync(createUnvanDto);
            return CreatedAtAction(nameof(GetById), new { id = unvan.UnvanID }, ApiResponse<UnvanDto>.Ok(unvan));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<UnvanDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.UpdateUnvan)]
    public async Task<ActionResult<ApiResponse<UnvanDto>>> Update(int id, UpdateUnvanDto updateUnvanDto)
    {
        try
        {
            var unvan = await _unvanService.UpdateUnvanAsync(id, updateUnvanDto);
            if (unvan == null) return NotFound(ApiResponse<UnvanDto>.Fail("Ünvan bulunamadı", "NOT_FOUND"));
            return Ok(ApiResponse<UnvanDto>.Ok(unvan));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<UnvanDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.DeleteUnvan)]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _unvanService.DeleteUnvanAsync(id);
        if (!result) return NotFound(ApiResponse<bool>.Fail("Ünvan bulunamadı", "NOT_FOUND"));
        return Ok(ApiResponse<bool>.Ok(true, "Ünvan silindi"));
    }
}
