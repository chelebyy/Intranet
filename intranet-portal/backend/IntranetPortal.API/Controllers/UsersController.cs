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
            var isSuperAdmin = IsStrictSuperAdmin();

            // 2. Check if user is SuperAdmin
            if (isSuperAdmin)
            {
                var allUsers = await _userService.GetAllUsersAsync();
                return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(allUsers));
            }

            if (!activeBirimId.HasValue)
            {
                return StatusCode(403, ApiResponse<IEnumerable<UserDto>>.Fail("Aktif birim seçimi gereklidir", "FORBIDDEN"));
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

            if (!IsStrictSuperAdmin())
            {
                var activeBirimId = User.GetBirimId();
                if (!activeBirimId.HasValue)
                {
                    return StatusCode(403, ApiResponse<UserDto>.Fail("Aktif birim seçimi gereklidir", "FORBIDDEN"));
                }

                var scopedRoles = user.BirimRoles?
                    .Where(br => br.BirimID == activeBirimId.Value)
                    .ToList() ?? [];

                if (scopedRoles.Count == 0)
                {
                    return StatusCode(403, ApiResponse<UserDto>.Fail("Bu kullanıcıyı yönetme yetkiniz bulunmamaktadır", "FORBIDDEN"));
                }

                user.BirimRoles = scopedRoles;
            }

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

            if (!await CanManageUserInActiveBirimAsync(id))
                return StatusCode(403, ApiResponse<UserDto>.Fail("Bu kullanıcıyı güncelleme yetkiniz bulunmamaktadır", "FORBIDDEN"));

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
            if (!await CanManageUserInActiveBirimAsync(id))
                return StatusCode(403, ApiResponse<bool>.Fail("Bu kullanıcıyı silme yetkiniz bulunmamaktadır", "FORBIDDEN"));

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

            if (!await CanManageUserInActiveBirimAsync(id))
                return StatusCode(403, ApiResponse<bool>.Fail("Bu kullanıcının şifresini sıfırlama yetkiniz bulunmamaktadır", "FORBIDDEN"));

            var result = await _userService.ResetPasswordAsync(id, resetPasswordDto.NewPassword);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Password reset successfully."));
        }

        [HttpPost("{id}/birim-role")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> AddBirimRoleAssignment(int id, [FromBody] BirimRoleAssignmentDto dto)
        {
            if (!CanManageAssignmentBirim(dto.BirimId))
                return StatusCode(403, ApiResponse<bool>.Fail("Sadece aktif biriminiz içinde atama yapabilirsiniz", "FORBIDDEN"));

            var result = await _userService.AddBirimRoleAssignmentAsync(id, dto.BirimId, dto.RoleId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Kullanıcı bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması başarılı"));
        }

        [HttpDelete("{id}/birim-role/{birimId}")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveBirimRoleAssignment(int id, int birimId)
        {
            if (!CanManageAssignmentBirim(birimId))
                return StatusCode(403, ApiResponse<bool>.Fail("Sadece aktif biriminiz içindeki atamaları kaldırabilirsiniz", "FORBIDDEN"));

            var result = await _userService.RemoveBirimRoleAssignmentAsync(id, birimId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Atama bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması kaldırıldı"));
        }

        [HttpPut("{id}/birim-role/{birimId}")]
        [HasPermission(Permissions.UpdateUser)]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateBirimRoleAssignment(int id, int birimId, [FromBody] UpdateBirimRoleDto dto)
        {
            if (!CanManageAssignmentBirim(birimId))
                return StatusCode(403, ApiResponse<bool>.Fail("Sadece aktif biriminiz içindeki atamaları güncelleyebilirsiniz", "FORBIDDEN"));

            var result = await _userService.UpdateBirimRoleAssignmentAsync(id, birimId, dto.RoleId);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Atama bulunamadı", "NOT_FOUND"));

            return Ok(ApiResponse<bool>.Ok(true, "Birim-rol ataması güncellendi"));
        }

        private bool IsStrictSuperAdmin()
        {
            return User.GetRoleName() == Roles.SuperAdmin;
        }

        private async Task<bool> CanManageUserInActiveBirimAsync(int userId)
        {
            if (IsStrictSuperAdmin())
                return true;

            var activeBirimId = User.GetBirimId();
            if (!activeBirimId.HasValue)
                return false;

            var user = await _userService.GetUserByIdAsync(userId);
            return user?.BirimRoles?.Any(br => br.BirimID == activeBirimId.Value) == true;
        }

        private bool CanManageAssignmentBirim(int birimId)
        {
            if (IsStrictSuperAdmin())
                return true;

            var activeBirimId = User.GetBirimId();
            return activeBirimId.HasValue && activeBirimId.Value == birimId;
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
