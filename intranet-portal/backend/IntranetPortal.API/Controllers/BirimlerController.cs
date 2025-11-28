using IntranetPortal.API.Attributes;
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
    [HasPermission(Permissions.ReadBirim)]
    public async Task<IActionResult> GetAll()
    {
        var birimler = await _birimService.GetAllBirimsAsync();
        return Ok(birimler);
    }

    [HttpGet("{id}")]
    [HasPermission(Permissions.ReadBirim)]
    public async Task<IActionResult> GetById(int id)
    {
        var birim = await _birimService.GetBirimByIdAsync(id);
        if (birim == null) return NotFound();
        return Ok(birim);
    }

    [HttpPost]
    [HasPermission(Permissions.CreateBirim)]
    public async Task<IActionResult> Create(CreateBirimDto createBirimDto)
    {
        try
        {
            var birim = await _birimService.CreateBirimAsync(createBirimDto);
            return CreatedAtAction(nameof(GetById), new { id = birim.BirimID }, birim);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [HasPermission(Permissions.UpdateBirim)]
    public async Task<IActionResult> Update(int id, UpdateBirimDto updateBirimDto)
    {
        try
        {
            var birim = await _birimService.UpdateBirimAsync(id, updateBirimDto);
            if (birim == null) return NotFound();
            return Ok(birim);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [HasPermission(Permissions.DeleteBirim)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _birimService.DeleteBirimAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
