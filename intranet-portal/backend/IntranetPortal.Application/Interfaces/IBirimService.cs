using IntranetPortal.Application.DTOs;
using IntranetPortal.Application.DTOs.Birims;

namespace IntranetPortal.Application.Interfaces;

public interface IBirimService
{
    Task<IEnumerable<BirimDto>> GetAllBirimsAsync(bool includeInactive = false);
    Task<BirimDto?> GetBirimByIdAsync(int id);
    Task<BirimDto> CreateBirimAsync(CreateBirimDto createBirimDto);
    Task<BirimDto?> UpdateBirimAsync(int id, UpdateBirimDto updateBirimDto);
    Task<bool> DeleteBirimAsync(int id);
}
