# .NET 10 Migration Rollback Plan

**Document**: NET10_ROLLBACK.md  
**Date**: 2026-04-03  
**Baseline Tag**: `pre-net10-migration`  
**Baseline Commit**: 99031855ba698255f87069a40ea8539ec1811cbf  

---

## Overview

This document provides the rollback procedure in case the .NET 10 migration needs to be reverted.

**Current Status**: Phase 1 Complete (Test Infrastructure)  
**Phase 2 Status**: BLOCKED - .NET 10 SDK not installed  
**Rollback Readiness**: ✅ Baseline tagged and documented

---

## Prerequisites for Rollback

1. **Git access** to repository
2. **Backup verification** - Confirm `pre-net10-migration` tag exists:
   ```bash
   git tag -l | grep pre-net
   ```

3. **Database backup** (if Phase 2 EF migrations were applied):
   ```bash
   # Before any rollback, backup database
   pg_dump -h localhost -U postgres IntranetDB > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

---

## Rollback Scenarios

### Scenario A: Pre-Migration (Current State)

**Applies if**: Phase 2 has NOT started  
**Current State**: ✅ We're here

No rollback needed - baseline is preserved.

### Scenario B: Post-Migration Rollback

**Applies if**: Phase 2 completed but issues discovered

#### Step 1: Stop Services
```bash
# Stop all running backend instances
# Windows
Get-Process dotnet | Stop-Process

# Or if using IIS/app service
iisreset /stop
```

#### Step 2: Database Rollback (if migrations applied)

```bash
cd intranet-portal/backend

# View available migrations
dotnet ef migrations list --project IntranetPortal.Infrastructure --startup-project IntranetPortal.API

# Revert to migration before .NET 10
dotnet ef database update [PreviousMigrationName] \
  --project IntranetPortal.Infrastructure \
  --startup-project IntranetPortal.API
```

#### Step 3: Code Rollback

```bash
# Fetch latest tags
git fetch --tags

# Create rollback branch from baseline
git checkout -b rollback/net10 pre-net10-migration

# Or hard reset (DESTRUCTIVE - use with caution)
git checkout feature/test-infrastructure
git reset --hard pre-net10-migration
```

#### Step 4: Verify .NET 9 SDK
```bash
dotnet --version
# Should show: 9.0.x
```

#### Step 5: Restore and Build
```bash
cd intranet-portal/backend
dotnet restore
dotnet build
```

#### Step 6: Test Suite
```bash
# Run all tests
dotnet test IntranetPortal.sln

# Verify smoke tests pass
dotnet test --filter Health
```

#### Step 7: Restart Services
```bash
# Windows
iisreset /start

# Or run directly
dotnet run --project IntranetPortal.API
```

---

## Verification Checklist

After rollback, verify:

- [ ] `dotnet --version` shows 9.0.x
- [ ] All .csproj files show `<TargetFramework>net9.0</TargetFramework>`
- [ ] `dotnet restore` completes without errors
- [ ] `dotnet build` completes without errors
- [ ] All tests pass (`dotnet test`)
- [ ] Health endpoint responds correctly
- [ ] Login functionality works
- [ ] Database schema matches pre-migration state

---

## Package Downgrade Reference

If NuGet packages were upgraded to 10.x, downgrade to these versions:

| Package | .NET 9 Version | .NET 10 Version |
|---------|---------------|-----------------|
| Microsoft.EntityFrameworkCore | 9.0.4 | 10.x |
| Npgsql.EntityFrameworkCore.PostgreSQL | 9.0.4 | 10.x |
| Microsoft.AspNetCore.Authentication.JwtBearer | 9.0.0 | 10.x |
| Microsoft.AspNetCore.Mvc.Testing | 9.0.0 | 10.x |

Rollback command:
```bash
cd intranet-portal/backend
dotnet add IntranetPortal.API package Microsoft.EntityFrameworkCore --version 9.0.4
dotnet add IntranetPortal.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL --version 9.0.4
# ... repeat for all packages
```

---

## Emergency Contacts

**Issue Escalation Path**:
1. **Dev Team Lead** - Technical decisions
2. **Infrastructure Team** - Server/DB access
3. **Product Owner** - Business continuity

---

## Known Issues

### Npgsql Timestamp Behavior

**Issue**: .NET 10 may change `Npgsql.EnableLegacyTimestampBehavior` default  
**Symptom**: DateTime conversion errors  
**Fix**: Ensure `AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true)` in Program.cs

### JWT Token Changes

**Issue**: JWT library version changes in .NET 10  
**Symptom**: Token validation failures  
**Fix**: Check `System.IdentityModel.Tokens.Jwt` compatibility

---

## Rollback Testing

Before declaring rollback complete, run:

```bash
cd intranet-portal/backend

# Clean build
dotnet clean
dotnet restore
dotnet build

# Run full test suite
dotnet test IntranetPortal.sln --verbosity normal

# Integration test (requires Docker/PostgreSQL)
dotnet test tests/IntranetPortal.IntegrationTests

# Frontend tests
cd ../frontend
npm run test:unit
```

---

## Timeline Estimates

| Step | Estimated Time |
|------|---------------|
| Service Stop | 1-2 minutes |
| Database Rollback | 2-5 minutes |
| Code Rollback | 1 minute |
| Restore & Build | 3-5 minutes |
| Testing | 5-10 minutes |
| Service Start | 1-2 minutes |
| **Total** | **~15-25 minutes** |

---

## Post-Rollback Actions

1. **Document incident** - What triggered rollback?
2. **Notify stakeholders** - Update on system status
3. **Analyze root cause** - Why did migration fail?
4. **Plan retry** - When/how to attempt migration again?

---

## Related Documents

- [TEKNOLOJI_GECIS_PLANI.md](../TEKNOLOJI_GECIS_PLANI.md) - Full migration plan
- [NET9_PACKAGE_BASELINE.md](./NET9_PACKAGE_BASELINE.md) - Package versions
- [auth-test-contracts.md](./auth-test-contracts.md) - Auth flow specs

---

*Document version 1.0 - Rollback procedures for .NET 10 migration*
