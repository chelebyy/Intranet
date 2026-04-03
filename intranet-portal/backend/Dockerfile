# Dockerfile for .NET 10 API
# This Dockerfile is designed to be run from the /backend directory (or root with context adjustments)

# Toplama (Build) Aşaması
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala (Restore işlemi için)
# Katmanları önbelleğe almak için önce sadece csproj'ları kopyalıyoruz
COPY ["IntranetPortal.API/IntranetPortal.API.csproj", "IntranetPortal.API/"]
COPY ["IntranetPortal.Application/IntranetPortal.Application.csproj", "IntranetPortal.Application/"]
COPY ["IntranetPortal.Domain/IntranetPortal.Domain.csproj", "IntranetPortal.Domain/"]
COPY ["IntranetPortal.Infrastructure/IntranetPortal.Infrastructure.csproj", "IntranetPortal.Infrastructure/"]

# Bağımlılıkları yükle
RUN dotnet restore "IntranetPortal.API/IntranetPortal.API.csproj"

# Tüm kodları kopyala
COPY . .

# Uygulamayı derle (Release modunda)
WORKDIR "/src/IntranetPortal.API"
RUN dotnet build "IntranetPortal.API.csproj" -c Release -o /app/build

# Yayınlama (Publish) Aşaması
FROM build AS publish
RUN dotnet publish "IntranetPortal.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Çalıştırma (Runtime) Aşaması
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

EXPOSE 8080

COPY --from=publish /app/publish .
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet IntranetPortal.API.dll"]
