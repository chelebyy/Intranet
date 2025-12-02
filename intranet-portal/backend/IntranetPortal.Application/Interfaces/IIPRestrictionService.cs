using IntranetPortal.Application.DTOs;

namespace IntranetPortal.Application.Interfaces;

public interface IIPRestrictionService
{
    Task<List<IPRestrictionDto>> GetAllAsync();
    Task<IPRestrictionDto?> GetByIdAsync(int id);
    Task<IPRestrictionDto> CreateAsync(CreateIPRestrictionDto dto, int? createdBy);
    Task<IPRestrictionDto?> UpdateAsync(int id, UpdateIPRestrictionDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> IsIPAllowedAsync(string ipAddress);
}
