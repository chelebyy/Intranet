using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Birims;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services;

public class BirimService : IBirimService
{
    private readonly IIntranetDbContext _context;

    public BirimService(IIntranetDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BirimDto>> GetAllBirimsAsync(bool includeInactive = false)
    {
        var query = _context.Birimler.AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(b => b.IsActive);
        }

        return await query
            .Select(b => new BirimDto
            {
                BirimID = b.BirimID,
                BirimAdi = b.BirimAdi,
                Aciklama = b.Aciklama,
                IsActive = b.IsActive
            })
            .ToListAsync();
    }

    public async Task<BirimDto?> GetBirimByIdAsync(int id)
    {
        var birim = await _context.Birimler.FindAsync(id);
        if (birim == null) return null;

        return new BirimDto
        {
            BirimID = birim.BirimID,
            BirimAdi = birim.BirimAdi,
            Aciklama = birim.Aciklama,
            IsActive = birim.IsActive
        };
    }

    public async Task<BirimDto> CreateBirimAsync(CreateBirimDto createBirimDto)
    {
        if (await _context.Birimler.AnyAsync(b => b.BirimAdi == createBirimDto.BirimAdi))
        {
            throw new InvalidOperationException($"Unit with name '{createBirimDto.BirimAdi}' already exists.");
        }

        var birim = new Birim
        {
            BirimAdi = createBirimDto.BirimAdi,
            Aciklama = createBirimDto.Aciklama,
            IsActive = createBirimDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Birimler.Add(birim);
        await _context.SaveChangesAsync();

        return new BirimDto
        {
            BirimID = birim.BirimID,
            BirimAdi = birim.BirimAdi,
            Aciklama = birim.Aciklama,
            IsActive = birim.IsActive
        };
    }

    public async Task<BirimDto?> UpdateBirimAsync(int id, UpdateBirimDto updateBirimDto)
    {
        var birim = await _context.Birimler.FindAsync(id);
        if (birim == null) return null;

        if (birim.BirimAdi != updateBirimDto.BirimAdi && await _context.Birimler.AnyAsync(b => b.BirimAdi == updateBirimDto.BirimAdi))
        {
            throw new InvalidOperationException($"Unit with name '{updateBirimDto.BirimAdi}' already exists.");
        }

        birim.BirimAdi = updateBirimDto.BirimAdi;
        birim.Aciklama = updateBirimDto.Aciklama;
        birim.IsActive = updateBirimDto.IsActive;
        birim.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new BirimDto
        {
            BirimID = birim.BirimID,
            BirimAdi = birim.BirimAdi,
            Aciklama = birim.Aciklama,
            IsActive = birim.IsActive
        };
    }

    public async Task<bool> DeleteBirimAsync(int id)
    {
        var birim = await _context.Birimler.FindAsync(id);
        if (birim == null) return false;

        // Soft delete - mark as inactive
        birim.IsActive = false;
        birim.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
