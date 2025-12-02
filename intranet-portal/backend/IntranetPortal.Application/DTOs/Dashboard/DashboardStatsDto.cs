namespace IntranetPortal.Application.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalBirimler { get; set; }
        public int ActiveBirimler { get; set; }
        public int TotalRoles { get; set; }
        public List<BirimUserCountDto> BirimUserCounts { get; set; } = new();
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    public class BirimUserCountDto
    {
        public int BirimId { get; set; }
        public string BirimAdi { get; set; } = string.Empty;
        public int UserCount { get; set; }
    }

    public class RecentActivityDto
    {
        public int Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? UserFullName { get; set; }
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; }
        public string TimeAgo { get; set; } = string.Empty;
        public string IconName { get; set; } = string.Empty;
    }
}
