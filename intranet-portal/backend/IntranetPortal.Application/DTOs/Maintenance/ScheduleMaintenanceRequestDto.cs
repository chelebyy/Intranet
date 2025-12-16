using System;

namespace IntranetPortal.Application.DTOs.Maintenance;

public class ScheduleMaintenanceRequestDto
{
    public DateTime? ScheduledTime { get; set; }
    public string? Message { get; set; }
    public bool CancelSchedule { get; set; } // If true, clears the schedule
}
