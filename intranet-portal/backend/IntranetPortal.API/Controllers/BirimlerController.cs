using IntranetPortal.API.Attributes;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Birims;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BirimlerController : ControllerBase
{
    private readonly IBirimService _birimService;

    public BirimlerController(IBirimService birimService)
    {
        _birimService = birimService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<BirimDto>>>> GetAll()
    {
        var birimler = await _birimService.GetAllBirimsAsync();
        return Ok(ApiResponse<IEnumerable<BirimDto>>.Ok(birimler));
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadBirim)]
    public async Task<ActionResult<ApiResponse<BirimDto>>> GetById(int id)
    {
        var birim = await _birimService.GetBirimByIdAsync(id);
        if (birim == null) return NotFound(ApiResponse<BirimDto>.Fail("Birim bulunamadı", "NOT_FOUND"));
        return Ok(ApiResponse<BirimDto>.Ok(birim));
    }

    [HttpPost]
    [HasPermission(Permissions.CreateBirim)]
    public async Task<ActionResult<ApiResponse<BirimDto>>> Create(CreateBirimDto createBirimDto)
    {
        try
        {
            var birim = await _birimService.CreateBirimAsync(createBirimDto);
            return CreatedAtAction(nameof(GetById), new { id = birim.BirimID }, ApiResponse<BirimDto>.Ok(birim));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<BirimDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.UpdateBirim)]
    public async Task<ActionResult<ApiResponse<BirimDto>>> Update(int id, UpdateBirimDto updateBirimDto)
    {
        try
        {
            var birim = await _birimService.UpdateBirimAsync(id, updateBirimDto);
            if (birim == null) return NotFound(ApiResponse<BirimDto>.Fail("Birim bulunamadı", "NOT_FOUND"));
            return Ok(ApiResponse<BirimDto>.Ok(birim));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<BirimDto>.Fail(ex.Message, "VALIDATION_ERROR"));
        }
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.DeleteBirim)]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _birimService.DeleteBirimAsync(id);
        if (!result) return NotFound(ApiResponse<bool>.Fail("Birim bulunamadı", "NOT_FOUND"));
        return Ok(ApiResponse<bool>.Ok(true, "Birim silindi"));
    }
}
