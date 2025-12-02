using IntranetPortal.Application.DTOs.Dashboard;
using IntranetPortal.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IntranetPortal.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IIntranetDbContext _context;

        public DashboardService(IIntranetDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var stats = new DashboardStatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                ActiveUsers = await _context.Users.CountAsync(u => u.IsActive),
                TotalBirimler = await _context.Birimler.CountAsync(),
                ActiveBirimler = await _context.Birimler.CountAsync(b => b.IsActive),
                TotalRoles = await _context.Roles.CountAsync()
            };

            // Birim bazında kullanıcı dağılımı
            stats.BirimUserCounts = await _context.UserBirimRoles
                .Include(ubr => ubr.Birim)
                .Where(ubr => ubr.User.IsActive)
                .GroupBy(ubr => new { ubr.BirimID, ubr.Birim.BirimAdi })
                .Select(g => new BirimUserCountDto
                {
                    BirimId = g.Key.BirimID,
                    BirimAdi = g.Key.BirimAdi,
                    UserCount = g.Count()
                })
                .OrderByDescending(x => x.UserCount)
                .Take(10)
                .ToListAsync();

            // Son aktiviteler
            stats.RecentActivities = await GetRecentActivitiesAsync(5);

            return stats;
        }

        public async Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 10)
        {
            var activities = await _context.AuditLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.TarihSaat)
                .Take(count)
                .Select(a => new RecentActivityDto
                {
                    Id = (int)a.LogID,
                    Action = a.Action,
                    UserFullName = a.User != null ? $"{a.User.Ad} {a.User.Soyad}" : "Sistem",
                    Details = a.Details,
                    Timestamp = a.TarihSaat,
                    TimeAgo = "", // Will be calculated
                    IconName = GetIconForAction(a.Action)
                })
                .ToListAsync();

            // Calculate TimeAgo
            foreach (var activity in activities)
            {
                activity.TimeAgo = GetTimeAgo(activity.Timestamp);
            }

            return activities;
        }

        private static string GetIconForAction(string action)
        {
            return action.ToUpperInvariant() switch
            {
                "LOGIN" => "login",
                "LOGOUT" => "logout",
                "CREATE_USER" or "USER_CREATED" => "person_add",
                "UPDATE_USER" or "USER_UPDATED" => "edit",
                "DELETE_USER" or "USER_DELETED" => "delete",
                "PASSWORD_RESET" => "lock_reset",
                "CREATE_ROLE" or "ROLE_CREATED" => "shield",
                "UPDATE_ROLE" or "ROLE_UPDATED" => "shield",
                "CREATE_BIRIM" or "BIRIM_CREATED" => "apartment",
                "UPDATE_BIRIM" or "BIRIM_UPDATED" => "apartment",
                "SELECT_BIRIM" => "swap_horiz",
                _ => "info"
            };
        }

        private static string GetTimeAgo(DateTime timestamp)
        {
            var now = DateTime.UtcNow;
            var diff = now - timestamp;

            if (diff.TotalMinutes < 1)
                return "Az önce";
            if (diff.TotalMinutes < 60)
                return $"{(int)diff.TotalMinutes} dakika önce";
            if (diff.TotalHours < 24)
                return $"{(int)diff.TotalHours} saat önce";
            if (diff.TotalDays < 7)
                return $"{(int)diff.TotalDays} gün önce";
            if (diff.TotalDays < 30)
                return $"{(int)(diff.TotalDays / 7)} hafta önce";
            if (diff.TotalDays < 365)
                return $"{(int)(diff.TotalDays / 30)} ay önce";
            
            return $"{(int)(diff.TotalDays / 365)} yıl önce";
        }
    }
}
