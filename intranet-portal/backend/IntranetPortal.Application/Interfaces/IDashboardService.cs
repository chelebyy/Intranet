using IntranetPortal.Application.DTOs.Dashboard;

namespace IntranetPortal.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 10);
    }
}
