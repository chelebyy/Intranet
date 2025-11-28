using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Users;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IIntranetDbContext _context;
        private readonly IPasswordService _passwordService;

        public UserService(IIntranetDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    UserID = u.UserID,
                    AdSoyad = u.AdSoyad,
                    Sicil = u.Sicil,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    LastLoginAt = u.SonGiris
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                UserID = user.UserID,
                AdSoyad = user.AdSoyad,
                Sicil = user.Sicil,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.SonGiris
            };
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check if Sicil already exists
            if (await _context.Users.AnyAsync(u => u.Sicil == createUserDto.Sicil))
            {
                throw new InvalidOperationException($"User with Sicil '{createUserDto.Sicil}' already exists.");
            }

            var user = new User
            {
                AdSoyad = createUserDto.AdSoyad,
                Sicil = createUserDto.Sicil,
                Unvan = createUserDto.Unvan,
                SifreHash = _passwordService.HashPassword(createUserDto.Sifre),
                IsActive = createUserDto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                UserID = user.UserID,
                AdSoyad = user.AdSoyad,
                Sicil = user.Sicil,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                LastLoginAt = null
            };
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            // Check if Sicil is being changed to one that already exists
            if (user.Sicil != updateUserDto.Sicil && await _context.Users.AnyAsync(u => u.Sicil == updateUserDto.Sicil))
            {
                throw new InvalidOperationException($"User with Sicil '{updateUserDto.Sicil}' already exists.");
            }

            user.AdSoyad = updateUserDto.AdSoyad;
            user.Sicil = updateUserDto.Sicil;
            user.Unvan = updateUserDto.Unvan;
            user.IsActive = updateUserDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                UserID = user.UserID,
                AdSoyad = user.AdSoyad,
                Sicil = user.Sicil,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.SonGiris
            };
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            // Soft delete
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetPasswordAsync(int id, string newPassword)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.SifreHash = _passwordService.HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
