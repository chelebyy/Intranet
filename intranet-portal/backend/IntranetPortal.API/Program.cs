using System.Text;
using IntranetPortal.API.Data;
using IntranetPortal.API.Middleware;
using IntranetPortal.Infrastructure.Middleware;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Application.Services;
using IntranetPortal.Application.Settings;
using IntranetPortal.Infrastructure.Data;
using IntranetPortal.Infrastructure.Data.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure Npgsql to handle DateTime with UTC kind
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Database configuration
builder.Services.AddDbContext<IntranetDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);

    // Enable detailed errors and sensitive data logging in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Register DbContext interface using adapter pattern (avoids circular dependency)
builder.Services.AddScoped<IIntranetDbContext, IntranetDbContextAdapter>();

// Register Application Services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IBirimService, BirimService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IIPRestrictionService, IPRestrictionService>();
builder.Services.AddScoped<IUnvanService, UnvanService>();

// Configure BackupSettings and register BackupService as Singleton
// Singleton ensures thread-safe backup flag (_isBackupRunning) works correctly
builder.Services.Configure<BackupSettings>(builder.Configuration.GetSection(BackupSettings.SectionName));
builder.Services.AddSingleton<IBackupService, BackupService>();

// Register MaintenanceService as Scoped (uses static lock for thread-safety)
builder.Services.AddScoped<IMaintenanceService, MaintenanceService>();

builder.Services.AddMemoryCache();


// JWT Authentication Configuration
// Reference: TECHNICAL_DESIGN.md Section 2.1, SECURITY_ANALYSIS_REPORT.md Finding #2
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "IntranetPortal",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "IntranetUsers",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // No tolerance for expiration
    };

    // Read JWT token from HttpOnly cookie (NOT from Authorization header)
    // Reference: SECURITY_ANALYSIS_REPORT.md Finding #2
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = ExtractJwtToken(context.Request);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Add controllers with camelCase JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // In development, allow any origin for easier testing with proxies
        var allowAnyInDev = builder.Configuration.GetValue<bool>("Cors:AllowAnyOriginInDevelopment");
        if (builder.Environment.IsDevelopment() && allowAnyInDev)
        {
            policy.SetIsOriginAllowed(_ => true) // Allow any origin in development
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
        else
        {
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

// Seed database with initial data
await app.SeedDatabaseAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors();

// Security Middleware (before authentication)
// Reference: IMPLEMENTATION_ROADMAP.md - Faz 1, SECURITY_ANALYSIS_REPORT.md
app.UseIPWhitelist();      // IP Whitelist check
app.UseRateLimiting();     // Rate limiting

// Add authentication and authorization
app.UseAuthentication();
app.UseMiddleware<MaintenanceMiddleware>(); // Block requests if maintenance mode is active
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
})
.WithName("HealthCheck");

app.Run();

// Helper method to extract JWT token from request (reduces cognitive complexity)
static string? ExtractJwtToken(HttpRequest request)
{
    // Try to read token from cookie first
    if (request.Cookies.TryGetValue("auth_token", out var token))
    {
        return token;
    }
    
    // Fallback to Authorization header for API clients
    if (request.Headers.Authorization.Count > 0)
    {
        var authHeader = request.Headers.Authorization.ToString();
        if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return authHeader.Substring("Bearer ".Length).Trim();
        }
    }
    
    return null;
}
