using System.Collections.Concurrent;

namespace IntranetPortal.API.Middleware;

/// <summary>
/// Rate Limiting Middleware
/// Limits requests per IP address to prevent brute force attacks
/// Reference: IMPLEMENTATION_ROADMAP.md - Faz 1, SECURITY_ANALYSIS_REPORT.md
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly bool _isEnabled;
    private readonly int _maxRequests;
    private readonly int _windowSeconds;
    private readonly int _loginMaxRequests;
    private readonly int _loginWindowSeconds;

    // Thread-safe dictionary to track requests per IP
    private static readonly ConcurrentDictionary<string, RateLimitInfo> _requestCounts = new();

    public RateLimitingMiddleware(
        RequestDelegate next,
        ILogger<RateLimitingMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;

        // Read configuration
        _isEnabled = configuration.GetValue<bool>("SecuritySettings:RateLimiting:Enabled", true);
        _maxRequests = configuration.GetValue<int>("SecuritySettings:RateLimiting:MaxRequests", 100);
        _windowSeconds = configuration.GetValue<int>("SecuritySettings:RateLimiting:WindowSeconds", 60);
        _loginMaxRequests = configuration.GetValue<int>("SecuritySettings:RateLimiting:LoginMaxRequests", 5);
        _loginWindowSeconds = configuration.GetValue<int>("SecuritySettings:RateLimiting:LoginWindowSeconds", 60);

        _logger.LogInformation("Rate Limiting Middleware initialized. Enabled: {Enabled}, Max: {Max}/{Window}s, Login: {LoginMax}/{LoginWindow}s",
            _isEnabled, _maxRequests, _windowSeconds, _loginMaxRequests, _loginWindowSeconds);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip if disabled
        if (!_isEnabled)
        {
            await _next(context);
            return;
        }

        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var path = context.Request.Path.ToString().ToLower();
        var isLoginEndpoint = path.Contains("/auth/login");

        // Use stricter limits for login endpoint
        var maxRequests = isLoginEndpoint ? _loginMaxRequests : _maxRequests;
        var windowSeconds = isLoginEndpoint ? _loginWindowSeconds : _windowSeconds;
        var key = isLoginEndpoint ? $"{ip}:login" : ip;

        var now = DateTime.UtcNow;
        var rateLimitInfo = _requestCounts.GetOrAdd(key, _ => new RateLimitInfo());

        lock (rateLimitInfo)
        {
            // Reset if window has passed
            if ((now - rateLimitInfo.WindowStart).TotalSeconds >= windowSeconds)
            {
                rateLimitInfo.WindowStart = now;
                rateLimitInfo.RequestCount = 0;
            }

            rateLimitInfo.RequestCount++;

            // Check if limit exceeded
            if (rateLimitInfo.RequestCount > maxRequests)
            {
                var retryAfter = windowSeconds - (int)(now - rateLimitInfo.WindowStart).TotalSeconds;

                _logger.LogWarning("Rate limit exceeded for IP: {IP}, Path: {Path}, Requests: {Count}/{Max}",
                    ip, path, rateLimitInfo.RequestCount, maxRequests);

                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers["Retry-After"] = retryAfter.ToString();
                context.Response.Headers["X-RateLimit-Limit"] = maxRequests.ToString();
                context.Response.Headers["X-RateLimit-Remaining"] = "0";
                context.Response.Headers["X-RateLimit-Reset"] = ((DateTimeOffset)rateLimitInfo.WindowStart.AddSeconds(windowSeconds)).ToUnixTimeSeconds().ToString();

                context.Response.ContentType = "application/json";
                var response = new
                {
                    success = false,
                    error = new
                    {
                        code = "RATE_LIMIT_EXCEEDED",
                        message = isLoginEndpoint
                            ? $"Çok fazla giriş denemesi. Lütfen {retryAfter} saniye sonra tekrar deneyin."
                            : $"Çok fazla istek. Lütfen {retryAfter} saniye sonra tekrar deneyin.",
                        retryAfter = retryAfter
                    }
                };

                context.Response.WriteAsJsonAsync(response).Wait();
                return;
            }

            // Add rate limit headers
            context.Response.Headers["X-RateLimit-Limit"] = maxRequests.ToString();
            context.Response.Headers["X-RateLimit-Remaining"] = (maxRequests - rateLimitInfo.RequestCount).ToString();
            context.Response.Headers["X-RateLimit-Reset"] = ((DateTimeOffset)rateLimitInfo.WindowStart.AddSeconds(windowSeconds)).ToUnixTimeSeconds().ToString();
        }

        await _next(context);
    }

    private class RateLimitInfo
    {
        public DateTime WindowStart { get; set; } = DateTime.UtcNow;
        public int RequestCount { get; set; } = 0;
    }
}

/// <summary>
/// Extension method for adding Rate Limiting Middleware
/// </summary>
public static class RateLimitingMiddlewareExtensions
{
    public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RateLimitingMiddleware>();
    }
}
