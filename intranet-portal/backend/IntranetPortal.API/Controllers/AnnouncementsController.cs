using IntranetPortal.API.Attributes;
using IntranetPortal.API.Extensions;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Announcements;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;

        public AnnouncementsController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        #region Admin Endpoints

        [HttpPost]
        [HasPermission(Permissions.CreateAnnouncement)]
        public async Task<ActionResult<ApiResponse<AnnouncementDto>>> Create([FromBody] CreateAnnouncementDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<AnnouncementDto>.Fail("Geçersiz veri", "VALIDATION_ERROR"));

            var createdBy = User.GetUserId();
            var result = await _announcementService.CreateAsync(dto, createdBy);
            return CreatedAtAction(nameof(GetById), new { id = result.AnnouncementID }, ApiResponse<AnnouncementDto>.Ok(result, "Duyuru başarıyla oluşturuldu"));
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.UpdateAnnouncement)]
        public async Task<ActionResult<ApiResponse<AnnouncementDto>>> Update(int id, [FromBody] CreateAnnouncementDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<AnnouncementDto>.Fail("Geçersiz veri", "VALIDATION_ERROR"));

            try
            {
                var result = await _announcementService.UpdateAsync(id, dto);
                return Ok(ApiResponse<AnnouncementDto>.Ok(result, "Duyuru güncellendi"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<AnnouncementDto>.Fail("Duyuru bulunamadı", "NOT_FOUND"));
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.DeleteAnnouncement)]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            await _announcementService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.Ok(true, "Duyuru silindi (ar arşivlendi)"));
        }

        [HttpGet("admin")]
        [HasPermission(Permissions.ReadAnnouncement)]
        public async Task<ActionResult<ApiResponse<IEnumerable<AnnouncementDto>>>> GetAll()
        {
            var list = await _announcementService.GetAllAnnouncementsAsync();
            return Ok(ApiResponse<IEnumerable<AnnouncementDto>>.Ok(list));
        }

        [HttpGet("{id}")]
        [HasPermission(Permissions.ReadAnnouncement)] // Admin access to inspect ANY announcement
        public async Task<ActionResult<ApiResponse<AnnouncementDto>>> GetById(int id)
        {
            var result = await _announcementService.GetByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<AnnouncementDto>.Fail("Duyuru bulunamadı", "NOT_FOUND"));
            return Ok(ApiResponse<AnnouncementDto>.Ok(result));
        }

        #endregion

        #region User Endpoints

        [HttpGet("active")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AnnouncementDto>>>> GetActiveForUser()
        {
            var userId = User.GetUserId();
            var birimId = User.GetBirimId(); // Nullable, handles login vs dashboard context
            var roleId = User.GetRoleId();

            var list = await _announcementService.GetActiveAnnouncementsForUserAsync(userId, birimId, roleId);
            return Ok(ApiResponse<IEnumerable<AnnouncementDto>>.Ok(list));
        }

        [HttpPost("{id}/acknowledge")]
        public async Task<ActionResult<ApiResponse<bool>>> Acknowledge(int id)
        {
            var userId = User.GetUserId();
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            await _announcementService.AcknowledgeAsync(id, userId, ip);
            return Ok(ApiResponse<bool>.Ok(true, "Okundu olarak işaretlendi"));
        }

        #endregion
    }
}
