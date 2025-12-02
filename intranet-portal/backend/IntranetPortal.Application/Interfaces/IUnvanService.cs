using IntranetPortal.Application.DTOs.Unvans;

namespace IntranetPortal.Application.Interfaces;

public interface IUnvanService
{
    Task<IEnumerable<UnvanDto>> GetAllUnvansAsync();
    Task<UnvanDto?> GetUnvanByIdAsync(int id);
    Task<UnvanDto> CreateUnvanAsync(CreateUnvanDto createUnvanDto);
    Task<UnvanDto?> UpdateUnvanAsync(int id, UpdateUnvanDto updateUnvanDto);
    Task<bool> DeleteUnvanAsync(int id);
}
