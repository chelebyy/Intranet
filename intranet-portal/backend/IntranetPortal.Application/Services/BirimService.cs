using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Birims;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
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

    /// <summary>
    /// Duplicate ve geçersiz birimleri temizler.
    /// Sadece sistem modülleri (Sistem Yönetimi, Bilgi İşlem, Test Birimi) kalır.
    /// </summary>
    public async Task<CleanupResultDto> CleanupDuplicateBirimsAsync()
    {
        var result = new CleanupResultDto();
        
        // Korunacak birim isimleri
        var validBirimNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "Sistem Yönetimi",
            SystemModules.IT,      // "Bilgi İşlem"
            SystemModules.TestUnit // "Test Birimi"
        };

        var allBirims = await _context.Birimler.ToListAsync();
        var birimsToDelete = new List<Birim>();
        var keptBirimNames = new HashSet<string>();

        foreach (var birim in allBirims)
        {
            // Geçerli isimde mi?
            if (validBirimNames.Contains(birim.BirimAdi))
            {
                // Bu isimde zaten bir birim tuttuk mu? (duplicate kontrolü)
                if (keptBirimNames.Contains(birim.BirimAdi))
                {
                    // Duplicate - sil
                    birimsToDelete.Add(birim);
                }
                else
                {
                    // İlk kez görüyoruz - tut
                    keptBirimNames.Add(birim.BirimAdi);
                    result.KeptBirims.Add($"{birim.BirimAdi} (ID: {birim.BirimID})");
                }
            }
            else
            {
                // Geçersiz isim - sil
                birimsToDelete.Add(birim);
            }
        }

        // Silinecek birimleri kaydet
        foreach (var birim in birimsToDelete)
        {
            result.DeletedBirims.Add($"{birim.BirimAdi} (ID: {birim.BirimID})");
            _context.Birimler.Remove(birim);
        }

        await _context.SaveChangesAsync();

        result.DeletedCount = birimsToDelete.Count;
        result.Message = $"{result.DeletedCount} birim silindi, {result.KeptBirims.Count} birim korundu.";

        return result;
    }
}
