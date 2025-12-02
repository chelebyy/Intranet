using IntranetPortal.API.Attributes;
using IntranetPortal.API.Extensions;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Users;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [HasPermission(Permissions.ReadUser)]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllUsers()
        {
            // 1. Get Active Birim ID from Token
            var activeBirimId = User.GetBirimId();
            
            // 2. Check if user is SuperAdmin
            if (User.IsSuperAdmin() || !activeBirimId.HasValue)
            {
                // SuperAdmin sees all users, or if no unit selected (should be guarded by auth but fail-safe)
                // Note: If !activeBirimId.HasValue and NOT SuperAdmin, they probably shouldn't see anything or 
                // access this endpoint if HasPermission works correctly (it checks role permissions).
                var allUsers = await _userService.GetAllUsersAsync();
                return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(allUsers));
            }

            // 3. Filter by Active Birim
            var unitUsers = await _userService.GetUsersByBirimAsync(activeBirimId.Value);
            return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(unitUsers));
        }

        [HttpGet("{id}")]
        [HasPermission(Permissions.ReadUser)]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(ApiResponse<UserDto>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<UserDto>.Ok(user));
        }

        [HttpPost]
        [HasPermission(Permissions.CreateUser)]
        public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserDto>.Fail("Validasyon hatası", "VALIDATION_ERROR"));

            try
            {
                var createdUser = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.UserID }, ApiResponse<UserDto>.Ok(createdUser));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<UserDto>.Fail(ex.Message, "VALIDATION_ERROR"));
            }
        }

        [HttpPut("{id}")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserDto>.Fail("Validasyon hatası", "VALIDATION_ERROR"));

            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, updateUserDto);
                if (updatedUser == null)
                    return NotFound(ApiResponse<UserDto>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

                return Ok(ApiResponse<UserDto>.Ok(updatedUser));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<UserDto>.Fail(ex.Message, "VALIDATION_ERROR"));
            }
        }

        [HttpDelete("{id}")]
        [HasPermission(Permissions.DeleteUser)]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Kullanıcı silindi"));
        }

        [HttpPost("{id}/reset-password")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> ResetPassword(int id, [FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<bool>.Fail("Validasyon hatası", "VALIDATION_ERROR"));

            var result = await _userService.ResetPasswordAsync(id, resetPasswordDto.NewPassword);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Password reset successfully."));
        }

        [HttpPost("{id}/birim-role")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> AddBirimRoleAssignment(int id, [FromBody] BirimRoleAssignmentDto dto)
        {
            var result = await _userService.AddBirimRoleAssignmentAsync(id, dto.BirimId, dto.RoleId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması başarılı"));
        }

        [HttpDelete("{id}/birim-role/{birimId}")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveBirimRoleAssignment(int id, int birimId)
        {
            var result = await _userService.RemoveBirimRoleAssignmentAsync(id, birimId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Atama bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması kaldırıldı"));
        }

        [HttpPut("{id}/birim-role/{birimId}")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateBirimRoleAssignment(int id, int birimId, [FromBody] UpdateBirimRoleDto dto)
        {
            var result = await _userService.UpdateBirimRoleAssignmentAsync(id, birimId, dto.RoleId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Atama bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması güncellendi"));
        }
    }

    public class BirimRoleAssignmentDto
    {
        public int BirimId { get; set; }
        public int RoleId { get; set; }
    }

    public class UpdateBirimRoleDto
    {
        public int RoleId { get; set; }
    }
}
