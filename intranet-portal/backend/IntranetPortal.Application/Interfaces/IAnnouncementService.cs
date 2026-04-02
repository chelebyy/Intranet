using System.Collections.Generic;
using System.Threading.Tasks;
using IntranetPortal.Application.DTOs.Announcements;

namespace IntranetPortal.Application.Interfaces
{
    public interface IAnnouncementService
    {
        Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto, int createdByUserId, int? activeBirimId, bool isSuperAdmin);
        Task<AnnouncementDto> UpdateAsync(int id, CreateAnnouncementDto dto, int? activeBirimId, bool isSuperAdmin);
        Task DeleteAsync(int id);
        Task<AnnouncementDto?> GetByIdAsync(int id);
        
        // Admin Listing
        Task<IEnumerable<AnnouncementDto>> GetAllAnnouncementsAsync();

        // User Listing (Smart Filtering)
        Task<IEnumerable<AnnouncementDto>> GetActiveAnnouncementsForUserAsync(int userId, int? birimId, int? roleId);

        // Acknowledge (Mark as Read)
        Task AcknowledgeAsync(int announcementId, int userId, string ipAddress);
    }
}
