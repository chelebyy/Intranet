# .NET 9 Package Baseline

**Date**: 2026-04-03
**Branch**: feature/test-infrastructure
**Commit**: 99031855ba698255f87069a40ea8539ec1811cbf

## SDK Version
- .NET SDK: 9.0.307

## Project: IntranetPortal.API
| Package | Version |
|---------|---------|
| BCrypt.Net-Next | 4.1.0 |
| Microsoft.AspNetCore.Authentication.JwtBearer | 9.0.0 |
| Microsoft.AspNetCore.OpenApi | 9.0.11 |
| Microsoft.EntityFrameworkCore.Design | 9.0.4 |
| Serilog.AspNetCore | 10.0.0 |

## Project: IntranetPortal.Application
| Package | Version |
|---------|---------|
| AutoMapper.Extensions.Microsoft.DependencyInjection | 12.0.1 |
| BCrypt.Net-Next | 4.1.0 |
| FluentValidation.AspNetCore | 11.3.1 |
| Microsoft.EntityFrameworkCore | 9.0.4 |
| Microsoft.EntityFrameworkCore.Relational | 9.0.4 |
| System.IdentityModel.Tokens.Jwt | 8.17.0 |

## Project: IntranetPortal.Infrastructure
| Package | Version |
|---------|---------|
| BCrypt.Net-Next | 4.1.0 |
| Microsoft.EntityFrameworkCore | 9.0.4 |
| Microsoft.EntityFrameworkCore.Design | 9.0.4 |
| Microsoft.EntityFrameworkCore.Tools | 9.0.4 |
| Microsoft.Extensions.Hosting.Abstractions | 9.0.4 |
| Npgsql.EntityFrameworkCore.PostgreSQL | 9.0.4 |

## Test Projects
- **IntranetPortal.UnitTests** (xUnit, Moq, FluentAssertions)
- **IntranetPortal.IntegrationTests** (Testcontainers, xUnit, FluentAssertions)

## Pre-Migration Verification
- [x] All tests pass (Integration tests verified; Unit tests are currently empty shells)
- [x] Build succeeds
- [x] Git tag created: `pre-net10-migration`
