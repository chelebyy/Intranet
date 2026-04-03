using System.Net;
using System.Text.Json;
using FluentAssertions;
using IntranetPortal.IntegrationTests.Infrastructure;

namespace IntranetPortal.IntegrationTests.Health;

public class HealthEndpointTests : IClassFixture<IntegrationTestWebAppFactory>
{
    private readonly IntegrationTestWebAppFactory _factory;

    public HealthEndpointTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetHealth_ReturnsHealthy()
    {
        if (!_factory.IsPostgreSqlContainerAvailable)
        {
            return;
        }

        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var health = JsonSerializer.Deserialize<HealthResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        health.Should().NotBeNull();
        health!.Status.Should().Be("healthy");
        health.Timestamp.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(10));
        health.Environment.Should().NotBeNullOrWhiteSpace();
    }

    public class HealthResponse
    {
        public string Status { get; set; } = default!;
        public DateTime Timestamp { get; set; }
        public string Environment { get; set; } = default!;
    }
}
