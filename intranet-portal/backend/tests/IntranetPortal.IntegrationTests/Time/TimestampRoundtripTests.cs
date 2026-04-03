using FluentAssertions;
using IntranetPortal.Domain.Entities;
using IntranetPortal.Infrastructure.Data;
using IntranetPortal.IntegrationTests.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace IntranetPortal.IntegrationTests.Time;

public class TimestampRoundtripTests : IClassFixture<IntegrationTestWebAppFactory>, IDisposable
{
    private readonly IntegrationTestWebAppFactory _factory;
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly IntranetDbContext _context;

    public TimestampRoundtripTests(IntegrationTestWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<IntranetDbContext>();
    }

    [Fact]
    public async Task DateTime_StoredAsUtc_RetrievedAsUtc()
    {
        if (!_factory.IsPostgreSqlContainerAvailable)
        {
            return;
        }

        // Arrange
        var now = DateTime.UtcNow;
        var user = new User
        {
            Ad = "Test",
            Soyad = "Timestamp",
            Sicil = $"TS-{Guid.NewGuid():N}"[..20],
            SifreHash = "test-hash",
            CreatedAt = now,
            UpdatedAt = now
        };

        // Act
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _context.ChangeTracker.Clear();

        // Assert
        var retrieved = await _context.Users.FindAsync(user.UserID);
        retrieved.Should().NotBeNull();
        retrieved!.CreatedAt.Kind.Should().Be(DateTimeKind.Utc);
        retrieved.CreatedAt.Should().BeCloseTo(now, TimeSpan.FromSeconds(1));
    }

    public void Dispose()
    {
        _scope.Dispose();
        _client.Dispose();
    }
}
