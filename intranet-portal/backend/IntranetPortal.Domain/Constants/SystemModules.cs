using System.Collections.Generic;

namespace IntranetPortal.Domain.Constants;

public static class SystemModules
{
    public const string IT = "Bilgi İşlem";
    public const string TestUnit = "Test Birimi";

    public static readonly IReadOnlyList<string> All = new[]
    {
        IT,
        TestUnit
    };

    public static string GetDescription(string module)
    {
        return module switch
        {
            IT => "Bilgi İşlem Modülü",
            TestUnit => "Test Birimi Modülü",
            _ => "Sistem Modülü"
        };
    }
}
