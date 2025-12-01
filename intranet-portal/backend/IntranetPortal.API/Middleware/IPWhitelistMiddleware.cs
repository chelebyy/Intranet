using System.Net;

namespace IntranetPortal.API.Middleware;

/// <summary>
/// IP Whitelist Middleware
/// Blocks requests from IPs not in the allowed list
/// Reference: IMPLEMENTATION_ROADMAP.md - Faz 1, SECURITY_ANALYSIS_REPORT.md
/// </summary>
public class IPWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<IPWhitelistMiddleware> _logger;
    private readonly HashSet<string> _allowedIPs;
    private readonly List<(IPAddress Network, int PrefixLength)> _allowedCIDRs;
    private readonly bool _isEnabled;

    public IPWhitelistMiddleware(
        RequestDelegate next,
        ILogger<IPWhitelistMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _allowedIPs = new HashSet<string>();
        _allowedCIDRs = new List<(IPAddress, int)>();

        // Read configuration
        _isEnabled = configuration.GetValue<bool>("SecuritySettings:IPWhitelist:Enabled", false);
        var allowedRanges = configuration.GetSection("SecuritySettings:IPWhitelist:AllowedRanges").Get<string[]>() ?? Array.Empty<string>();

        foreach (var range in allowedRanges)
        {
            if (range.Contains('/'))
            {
                // CIDR notation (e.g., 192.168.1.0/24)
                var parts = range.Split('/');
                if (IPAddress.TryParse(parts[0], out var network) && int.TryParse(parts[1], out var prefix))
                {
                    _allowedCIDRs.Add((network, prefix));
                }
            }
            else
            {
                // Single IP
                _allowedIPs.Add(range);
            }
        }

        _logger.LogInformation("IP Whitelist Middleware initialized. Enabled: {Enabled}, Allowed IPs: {Count}, CIDR Ranges: {CIDRCount}",
            _isEnabled, _allowedIPs.Count, _allowedCIDRs.Count);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip if disabled
        if (!_isEnabled)
        {
            await _next(context);
            return;
        }

        var remoteIP = context.Connection.RemoteIpAddress;

        if (remoteIP == null)
        {
            _logger.LogWarning("Request with no remote IP address blocked");
            await WriteBlockedResponse(context, "Unknown");
            return;
        }

        var ipString = remoteIP.ToString();

        // Always allow localhost
        if (IsLocalhost(remoteIP))
        {
            await _next(context);
            return;
        }

        // Check if IP is allowed
        if (!IsIPAllowed(remoteIP, ipString))
        {
            _logger.LogWarning("IP blocked: {IP}", ipString);
            await WriteBlockedResponse(context, ipString);
            return;
        }

        await _next(context);
    }

    private bool IsLocalhost(IPAddress ip)
    {
        return IPAddress.IsLoopback(ip) ||
               ip.ToString() == "::1" ||
               ip.ToString() == "127.0.0.1";
    }

    private bool IsIPAllowed(IPAddress ip, string ipString)
    {
        // Check exact match
        if (_allowedIPs.Contains(ipString))
            return true;

        // Check CIDR ranges
        foreach (var (network, prefixLength) in _allowedCIDRs)
        {
            if (IsInRange(ip, network, prefixLength))
                return true;
        }

        return false;
    }

    private bool IsInRange(IPAddress ip, IPAddress network, int prefixLength)
    {
        var ipBytes = ip.GetAddressBytes();
        var networkBytes = network.GetAddressBytes();

        if (ipBytes.Length != networkBytes.Length)
            return false;

        var bytesToCheck = prefixLength / 8;
        var remainingBits = prefixLength % 8;

        for (int i = 0; i < bytesToCheck; i++)
        {
            if (ipBytes[i] != networkBytes[i])
                return false;
        }

        if (remainingBits > 0 && bytesToCheck < ipBytes.Length)
        {
            var mask = (byte)(0xFF << (8 - remainingBits));
            if ((ipBytes[bytesToCheck] & mask) != (networkBytes[bytesToCheck] & mask))
                return false;
        }

        return true;
    }

    private async Task WriteBlockedResponse(HttpContext context, string ip)
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        context.Response.ContentType = "application/json";

        var response = new
        {
            success = false,
            error = new
            {
                code = "IP_NOT_WHITELISTED",
                message = "Bu IP adresinden erişim izni bulunmamaktadır.",
                ip = ip
            }
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}

/// <summary>
/// Extension method for adding IP Whitelist Middleware
/// </summary>
public static class IPWhitelistMiddlewareExtensions
{
    public static IApplicationBuilder UseIPWhitelist(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<IPWhitelistMiddleware>();
    }
}
