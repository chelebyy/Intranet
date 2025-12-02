using IntranetPortal.API.Attributes;
using IntranetPortal.API.Models;
using IntranetPortal.Application.DTOs.Dashboard;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Dashboard istatistiklerini getirir
        /// </summary>
        [HttpGet("stats")]
        [HasPermission(Permissions.ViewDashboard)]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetStats()
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
        }

        /// <summary>
        /// Son sistem aktivitelerini getirir
        /// </summary>
        [HttpGet("activities")]
        [HasPermission(Permissions.ViewDashboard)]
        public async Task<ActionResult<ApiResponse<List<RecentActivityDto>>>> GetActivities([FromQuery] int count = 10)
        {
            if (count < 1 || count > 50)
                count = 10;
                
            var activities = await _dashboardService.GetRecentActivitiesAsync(count);
            return Ok(ApiResponse<List<RecentActivityDto>>.Ok(activities));
        }
    }
}
