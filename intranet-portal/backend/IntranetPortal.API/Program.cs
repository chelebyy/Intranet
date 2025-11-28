using System.Text;
using IntranetPortal.API.Data;
using IntranetPortal.Application.Interfaces;
using IntranetPortal.Application.Services;
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
            // Try to read token from cookie first
            if (context.Request.Cookies.TryGetValue("auth_token", out var token))
            {
                context.Token = token;
            }
            // Fallback to Authorization header for API clients (optional)
            else if (context.Request.Headers.Authorization.Count > 0)
            {
                var authHeader = context.Request.Headers.Authorization.ToString();
                if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    context.Token = authHeader.Substring("Bearer ".Length).Trim();
                }
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Add controllers
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for cookie-based authentication
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

// Add authentication and authorization
app.UseAuthentication();
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
