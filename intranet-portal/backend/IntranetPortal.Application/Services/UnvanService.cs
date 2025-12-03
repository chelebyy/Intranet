using IntranetPortal.Application.DTOs.Unvans;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services;

public class UnvanService : IUnvanService
{
    private readonly IIntranetDbContext _context;

    public UnvanService(IIntranetDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UnvanDto>> GetAllUnvansAsync()
    {
        return await _context.Unvanlar
            .Select(u => new UnvanDto
            {
                UnvanID = u.UnvanID,
                UnvanAdi = u.UnvanAdi,
                Aciklama = u.Aciklama,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    public async Task<UnvanDto?> GetUnvanByIdAsync(int id)
    {
        var unvan = await _context.Unvanlar.FindAsync(id);
        if (unvan == null) return null;

        return new UnvanDto
        {
            UnvanID = unvan.UnvanID,
            UnvanAdi = unvan.UnvanAdi,
            Aciklama = unvan.Aciklama,
            IsActive = unvan.IsActive
        };
    }

    public async Task<UnvanDto> CreateUnvanAsync(CreateUnvanDto createUnvanDto)
    {
        if (await _context.Unvanlar.AnyAsync(u => u.UnvanAdi == createUnvanDto.UnvanAdi))
        {
            throw new InvalidOperationException($"'{createUnvanDto.UnvanAdi}' adında bir ünvan zaten mevcut.");
        }

        var unvan = new Unvan
        {
            UnvanAdi = createUnvanDto.UnvanAdi,
            Aciklama = createUnvanDto.Aciklama,
            IsActive = createUnvanDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Unvanlar.Add(unvan);
        await _context.SaveChangesAsync();

        return new UnvanDto
        {
            UnvanID = unvan.UnvanID,
            UnvanAdi = unvan.UnvanAdi,
            Aciklama = unvan.Aciklama,
            IsActive = unvan.IsActive
        };
    }

    public async Task<UnvanDto?> UpdateUnvanAsync(int id, UpdateUnvanDto updateUnvanDto)
    {
        var unvan = await _context.Unvanlar.FindAsync(id);
        if (unvan == null) return null;

        if (unvan.UnvanAdi != updateUnvanDto.UnvanAdi &&
            await _context.Unvanlar.AnyAsync(u => u.UnvanAdi == updateUnvanDto.UnvanAdi))
        {
            throw new InvalidOperationException($"'{updateUnvanDto.UnvanAdi}' adında bir ünvan zaten mevcut.");
        }

        unvan.UnvanAdi = updateUnvanDto.UnvanAdi;
        unvan.Aciklama = updateUnvanDto.Aciklama;
        unvan.IsActive = updateUnvanDto.IsActive;
        unvan.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new UnvanDto
        {
            UnvanID = unvan.UnvanID,
            UnvanAdi = unvan.UnvanAdi,
            Aciklama = unvan.Aciklama,
            IsActive = unvan.IsActive
        };
    }

    public async Task<bool> DeleteUnvanAsync(int id)
    {
        var unvan = await _context.Unvanlar.FindAsync(id);
        if (unvan == null) return false;

        // Soft delete
        unvan.IsActive = false;
        unvan.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
