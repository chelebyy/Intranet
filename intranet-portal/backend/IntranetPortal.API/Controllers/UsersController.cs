using IntranetPortal.API.Attributes;
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
            var users = await _userService.GetAllUsersAsync();
            return Ok(ApiResponse<IEnumerable<UserDto>>.Ok(users));
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
    }
}
