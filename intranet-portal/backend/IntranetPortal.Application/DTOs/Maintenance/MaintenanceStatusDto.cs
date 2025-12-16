namespace IntranetPortal.Application.DTOs.Maintenance;

public class MaintenanceStatusDto
{
    public bool IsMaintenanceActive { get; set; }
    public bool IsManualMaintenanceEnabled { get; set; }
    public string? MaintenanceMessage { get; set; }
    public DateTime? ScheduledMaintenanceTime { get; set; }
    public string? ScheduledMaintenanceMessage { get; set; }
}
