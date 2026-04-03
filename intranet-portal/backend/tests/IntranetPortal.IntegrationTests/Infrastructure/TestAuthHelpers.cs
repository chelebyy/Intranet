using System.Net.Http.Headers;

namespace IntranetPortal.IntegrationTests.Infrastructure;

public static class TestAuthHelpers
{
    public static HttpClient CreateAuthenticatedClient(this IntegrationTestWebAppFactory factory, string jwtToken)
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);

        return client;
    }
}
