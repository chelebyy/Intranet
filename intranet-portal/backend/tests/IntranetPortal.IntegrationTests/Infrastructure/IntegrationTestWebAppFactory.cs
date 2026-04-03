using IntranetPortal.Infrastructure.Data;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;

namespace IntranetPortal.IntegrationTests.Infrastructure;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private PostgreSqlContainer? _postgres;
    private bool _usePostgreSqlContainer = true;
    private bool _isContainerStarted;

    public bool IsPostgreSqlContainerAvailable => _usePostgreSqlContainer;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = _usePostgreSqlContainer
                    ? _postgres?.GetConnectionString()
                    : "Host=localhost;Port=5432;Database=intranet_test;Username=test;Password=test",
                ["JwtSettings:SecretKey"] = "integration-test-secret-key-minimum-32",
                ["SecuritySettings:IPWhitelist:Enabled"] = "false",
                ["SecuritySettings:RateLimiting:Enabled"] = "false"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<IntranetDbContext>>();
            services.RemoveAll<IntranetDbContext>();

            services.AddDbContext<IntranetDbContext>(options =>
            {
                options.UseNpgsql(_postgres!.GetConnectionString());
            });
        });
    }

    public async Task InitializeAsync()
    {
        try
        {
            _postgres = new PostgreSqlBuilder("postgres:16-alpine")
                .WithDatabase("intranet_test")
                .WithUsername("test")
                .WithPassword("test")
                .Build();

            await _postgres.StartAsync();
            _isContainerStarted = true;
        }
        catch (DockerUnavailableException)
        {
            _usePostgreSqlContainer = false;
        }
    }

    public new async Task DisposeAsync()
    {
        if (_isContainerStarted)
        {
            await _postgres!.DisposeAsync();
        }
    }
}
