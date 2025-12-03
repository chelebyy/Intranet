using System.Net;
using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services;

public class IPRestrictionService : IIPRestrictionService
{
    private readonly IIntranetDbContext _context;

    public IPRestrictionService(IIntranetDbContext context)
    {
        _context = context;
    }

    public async Task<List<IPRestrictionDto>> GetAllAsync()
    {
        return await _context.IPRestrictions
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new IPRestrictionDto
            {
                ID = x.ID,
                IPAddress = x.IPAddress,
                Description = x.Description,
                Type = x.Type,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                CreatedBy = x.CreatedBy
            })
            .ToListAsync();
    }

    public async Task<IPRestrictionDto?> GetByIdAsync(int id)
    {
        var entity = await _context.IPRestrictions.FindAsync(id);
        if (entity == null) return null;

        return new IPRestrictionDto
        {
            ID = entity.ID,
            IPAddress = entity.IPAddress,
            Description = entity.Description,
            Type = entity.Type,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy
        };
    }

    public async Task<IPRestrictionDto> CreateAsync(CreateIPRestrictionDto dto, int? createdBy)
    {
        var entity = new IPRestriction
        {
            IPAddress = dto.IPAddress,
            Description = dto.Description,
            Type = dto.Type,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        _context.IPRestrictions.Add(entity);
        await _context.SaveChangesAsync();

        return new IPRestrictionDto
        {
            ID = entity.ID,
            IPAddress = entity.IPAddress,
            Description = entity.Description,
            Type = entity.Type,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy
        };
    }

    public async Task<IPRestrictionDto?> UpdateAsync(int id, UpdateIPRestrictionDto dto)
    {
        var entity = await _context.IPRestrictions.FindAsync(id);
        if (entity == null) return null;

        if (dto.Description != null)
            entity.Description = dto.Description;

        if (dto.IsActive.HasValue)
            entity.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();

        return new IPRestrictionDto
        {
            ID = entity.ID,
            IPAddress = entity.IPAddress,
            Description = entity.Description,
            Type = entity.Type,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.IPRestrictions.FindAsync(id);
        if (entity == null) return false;

        _context.IPRestrictions.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsIPAllowedAsync(string ipAddress)
    {
        // Get all active restrictions
        var restrictions = await _context.IPRestrictions
            .Where(x => x.IsActive)
            .ToListAsync();

        if (!restrictions.Any())
            return true; // No restrictions = allow all

        var whitelisted = restrictions.Where(x => x.Type == "Whitelist").ToList();
        var blacklisted = restrictions.Where(x => x.Type == "Blacklist").ToList();

        // Check blacklist first
        foreach (var rule in blacklisted)
        {
            if (MatchesIP(ipAddress, rule.IPAddress))
                return false;
        }

        // If whitelist exists, IP must be in it
        if (whitelisted.Any())
        {
            foreach (var rule in whitelisted)
            {
                if (MatchesIP(ipAddress, rule.IPAddress))
                    return true;
            }
            return false; // Not in whitelist
        }

        return true; // No whitelist = allow (unless blacklisted)
    }

    private bool MatchesIP(string clientIP, string ruleIP)
    {
        // Exact match
        if (clientIP == ruleIP)
            return true;

        // CIDR match
        if (ruleIP.Contains('/'))
        {
            try
            {
                var parts = ruleIP.Split('/');
                if (IPAddress.TryParse(parts[0], out var network) &&
                    int.TryParse(parts[1], out var prefixLength) &&
                    IPAddress.TryParse(clientIP, out var client))
                {
                    return IsInRange(client, network, prefixLength);
                }
            }
            catch
            {
                return false;
            }
        }

        return false;
    }

    private bool IsInRange(IPAddress ip, IPAddress network, int prefixLength)
    {
        var ipBytes = ip.GetAddressBytes();
        var networkBytes = network.GetAddressBytes();

        if (ipBytes.Length != networkBytes.Length)
            return false;

        var bytesToCheck = prefixLength / 8;
        var remainingBits = prefixLength % 8;

        for (int i = 0; i < bytesToCheck; i++)
        {
            if (ipBytes[i] != networkBytes[i])
                return false;
        }

        if (remainingBits > 0 && bytesToCheck < ipBytes.Length)
        {
            var mask = (byte)(0xFF << (8 - remainingBits));
            if ((ipBytes[bytesToCheck] & mask) != (networkBytes[bytesToCheck] & mask))
                return false;
        }

        return true;
    }
}
