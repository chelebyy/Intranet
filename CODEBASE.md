# CODEBASE.md

> **Auto-generated project context.** Refreshed on every session start.

---

## Project Info

| Property | Value |
|----------|-------|
| **Project** | `Bilişim sistemi` |
| **Framework** | `react` |
| **Type** | `node` |
| **OS** | Windows |
| **Path** | `C:\Users\muham\OneDrive\Masaüstü\Bilişim sistemi` |

---

## Project Structure

> **Legend:** `file.ts <- A.tsx, B.tsx` = This file is **imported by** A.tsx and B.tsx.
> Directories with `[N files: ...]` are summarized to reduce size.
> [STATS] Showing 277 files. 9 dirs summarized, 16 dirs excluded (node_modules, etc.)


```
.agent/
  rules/
    advanced-react-component-patterns.md
    advanced-typescript-patterns.md
    ai-prompt-engineer-agent.md
    api-design-agent.md
    aspnet-core-csharp-framework.md
    code-migration-agent.md
    code-review-agent.md
    database-design-agent.md
    database-design-normalization.md
    database-migration-strategies.md
    debugging-agent.md
    devops-cicd-agent.md
    integration-testing-strategies.md
    performance-optimization-agent.md
    performance-testing-k6-jmeter.md
    postgresql-expert.md
    react-and-modern-javascript.md
    react-hooks-best-practices.md
    react-performance-optimization.md
    refactoring-agent.md
    rest-api-design-patterns.md
    security-audit-agent.md
    security-penetration-testing.md
    semantic-html-and-accessibility-expert.md
    sql-query-optimization.md
    strong-reasoner-planner-agent.md
    tailwind-css-expert.md
    test-driven-development-tdd.md
    test-writing-agent.md
    typescript-strict-mode-and-safety.md
    typescript-tooling-and-ecosystem.md
    unit-testing-best-practices.md
    web-security-best-practices.md
  workflows/
    csharp-fix.md
    dotnet-test.md
    front-fix.md
    genel/
      create-github-pull-request-template-markdown.md
      fix-eslint-prettier-linting-errors-automatically.md
      generate-typescript-types-from-openapi-schema.md
      guvenlik-kontrol.md
      js-hizli-kontrol.md
      kill-port.md
      run-pre-flight-check-type-lint-build.md
      security-hardening-headers-csp-rate-limiting.md
      update-npm-dependencies-check-updates.md
    guncelle.md
    hiz-testi.md
    hook-yaz.md
    implement-feature-flags-gradual-rollout.md
    react-loop-fix.md
    react-test.md
    setup-role-based-access-control-rbac.md
    sonar-fix.md
.claude/
  settings.local.json
HashGen/
  HashGen.csproj
  Program.cs
conductor/
  code_styleguides/
    general.md
    html-css.md
    typescript.md
  product-guidelines.md
  product.md
  setup_state.json
  tech-stack.md
  workflow.md
docs/ [59 files: 59 .md]
intranet-portal/
  .cursor/
    mcp.json
  .env.docker
  .gitignore
  DOCKER_KURULUM.md
  GUNCELLEME_VE_KURULUM.md
  PROJECT_STRUCTURE.md
  README.md
  SHADCN_REHBER.md
  TAILWIND_V4_MIGRATION.md
  backend/
    .sonarqube/
      conf/
        0/
          FilesToAnalyze.txt
          ProjectOutFolderPath.txt
          SonarProjectConfig.xml
        1/
          FilesToAnalyze.txt
          ProjectOutFolderPath.txt
          SonarProjectConfig.xml
        2/
          FilesToAnalyze.txt
          ProjectOutFolderPath.txt
          SonarProjectConfig.xml
        3/
          FilesToAnalyze.txt
          ProjectOutFolderPath.txt
          SonarProjectConfig.xml
        Sonar-cs-none.ruleset
        Sonar-cs.ruleset
        Sonar-vbnet-none.ruleset
        Sonar-vbnet.ruleset
        SonarQubeAnalysisConfig.xml
        cs/
          SonarLint.xml
        vbnet/
          SonarLint.xml
    Dockerfile
    IntranetPortal.API/ [27 files: 20 .cs, 2 .json, 2 .txt]
    IntranetPortal.Application/
      Class1.cs
      DTOs/ [30 files: 30 .cs]
      Interfaces/
        IAnnouncementService.cs
        IAuditLogService.cs
        IAuthenticationService.cs
        IBackupService.cs
        IBirimService.cs
        IDashboardService.cs
        IIPRestrictionService.cs
        IIntranetDbContext.cs
        IJwtTokenService.cs
        IMaintenanceService.cs
        IPasswordService.cs
        IPermissionService.cs
        IRoleService.cs
        IUnvanService.cs
        IUserService.cs
      IntranetPortal.Application.csproj
      Services/
        AnnouncementService.cs
        AuditLogService.cs
        AuthenticationService.cs
        BackupService.cs
        BirimService.cs
        DashboardService.cs
        IPRestrictionService.cs
        JwtTokenService.cs
        MaintenanceService.cs
        PasswordService.cs
        PermissionService.cs
        RoleService.cs
        UnvanService.cs
        UserService.cs
      Settings/
        BackupSettings.cs
      Validators/
        UserValidators.cs
      build_log.txt
      errors.txt
      log.txt
    IntranetPortal.Domain/
      Constants/
        Permissions.cs
        Roles.cs
        SystemModules.cs
        SystemSettingKeys.cs
      Entities/
        Announcement.cs
        AnnouncementTarget.cs
        AuditLog.cs
        Birim.cs
        IPRestriction.cs
        Permission.cs
        Role.cs
        RolePermission.cs
        SystemSettings.cs
        Unvan.cs
        UploadedFile.cs
        User.cs
        UserAcknowledgment.cs
        UserBirimRole.cs
      Enums/
        AuditAction.cs
        IT/
          ArizaDurum.cs
        RoleType.cs
      IntranetPortal.Domain.csproj
    IntranetPortal.Infrastructure/
      Configurations/
        AuditLogConfiguration.cs
        BirimConfiguration.cs
        PermissionConfiguration.cs
        RoleConfiguration.cs
        RolePermissionConfiguration.cs
        SystemSettingsConfiguration.cs
        UnvanConfiguration.cs
        UploadedFileConfiguration.cs
        UserBirimRoleConfiguration.cs
        UserConfiguration.cs
      Data/
        IntranetDbContext.cs
        Seeding/
          DatabaseSeeder.cs
          DatabaseSeederExtensions.cs
      IntranetPortal.Infrastructure.csproj
      Middleware/
        MaintenanceMiddleware.cs
      Migrations/
        20251126055557_InitialCreate.Designer.cs
        20251126055557_InitialCreate.cs
        20251126214725_FixDateTimeHandling.Designer.cs
        20251126214725_FixDateTimeHandling.cs
        20251127122617_AddSicilRemoveEmailFromUser.Designer.cs
        20251127122617_AddSicilRemoveEmailFromUser.cs
        20251202115539_AddIPRestrictions.Designer.cs
        20251202115539_AddIPRestrictions.cs
        20251202121515_SplitAdSoyad.Designer.cs
        20251202121515_SplitAdSoyad.cs
        20251202123934_AddUnvanTable.Designer.cs
        20251202123934_AddUnvanTable.cs
        20251216200753_AddAnnouncementSystem.Designer.cs
        20251216200753_AddAnnouncementSystem.cs
        IntranetDbContextModelSnapshot.cs
    README.md
    testsprite_tests/
      TC001_auth_api_login_functionality.py
      TC002_users_api_user_management.py
      TC003_roles_api_role_management.py
      TC004_auditlog_api_logging_and_retrieval.py
      TC005_dashboard_api_statistics_retrieval.py
      TC006_ip_restrictions_api_management.py
      TC007_backup_api_database_backup_and_restore.py
      TC008_birimler_api_department_management.py
      TC009_unvanlar_api_title_management.py
      TC010_permissions_api_permission_management.py
      standard_prd.json
      testsprite-mcp-test-report.html
      testsprite-mcp-test-report.md
      testsprite_backend_test_plan.json
  docker-compose.yml
  docs/ [7 files: 7 .md]
  frontend/
    .env.example
    .gitignore
    .scannerwork/
      .sonar_lock
      report-task.txt
    Dockerfile
    README.md
    components.json
    docs/ [3 files: 3 .md]
    eslint.config.js
    index.html
    package-lock.json
    package.json
    postcss.config.js
    public/ [1 files: 1 .svg]
    src/
      App.css
      App.tsx ← main.tsx
      api/
        announcementApi.ts ← AnnouncementEditor.tsx, AnnouncementList.tsx, AnnouncementBanner.tsx +2 more
        apiClient.ts ← announcementApi.ts, auditLogApi.ts, authApi.ts +11 more
        auditLogApi.ts ← AuditLogList.tsx, AuditLogList.tsx
        authApi.ts ← authStore.ts, Header.tsx, BirimSelection.tsx
        backupApi.ts ← BackupPage.tsx, BackupPage.tsx
        birimsApi.ts ← AnnouncementEditor.tsx, DepartmentList.tsx, UserEdit.tsx
        dashboardApi.ts ← Dashboard.tsx
        ipRestrictionsApi.ts ← IPRestrictions.tsx, IPRestrictions.tsx
        maintenanceApi.ts ← AdminLayout.tsx
        profileApi.ts ← Profile.tsx
        rolesApi.ts ← AnnouncementEditor.tsx, RolePermissions.tsx, UserEdit.tsx
        unvansApi.ts ← UnvanList.tsx, UserCreate.tsx, UserEdit.tsx
        usersApi.ts ← AnnouncementEditor.tsx, UserCreate.tsx, UserEdit.tsx +1 more
      assets/ [1 files: 1 .svg]
      components/
        common/
          AnnouncementBanner.tsx ← AdminLayout.tsx
          AnnouncementModal.tsx ← AdminLayout.tsx
          DashboardRouter.tsx ← App.tsx
          MaintenanceBanner.tsx ← AdminLayout.tsx
          ScheduledMaintenanceBanner.tsx ← AdminLayout.tsx
        dashboard/
          RecentAnnouncementsWidget.tsx ← HomeDashboard.tsx
        ui/ [63 files: 63 .tsx]
      features/
        admin/
          components/
            Sidebar.tsx
          pages/
            AnnouncementEditor.tsx
            AnnouncementList.tsx
            AuditLogList.tsx
            BackupPage.tsx
            Dashboard.tsx
            DepartmentList.tsx
            IPRestrictions.tsx
            MaintenancePage.tsx
            Profile.tsx
            Reports.tsx
            RolePermissions.tsx
            UnvanList.tsx
            UserCreate.tsx
            UserEdit.tsx
            UserList.tsx
        auth/
          BirimSelection.tsx ← App.tsx
          LoginPage.tsx ← App.tsx
        genelButce/
          pages/
            GenelButceDashboard.tsx
        it/
          pages/
            ArizaList.tsx
            ITDashboard.tsx
        test-unit/
          pages/
            TestCases.tsx
            TestUnitDashboard.tsx
      hooks/
        use-mobile.tsx ← sidebar.tsx
        usePermission.ts ← App.tsx, ProtectedRoute.tsx, AppSidebar.tsx +2 more
      index.css
      lib/
        utils.ts ← accordion.tsx, alert-dialog.tsx, alert.tsx +56 more
      main.tsx
      pages/
        MaintenanceLockPage.tsx ← App.tsx
        dashboard/
          HomeDashboard.tsx ← App.tsx
      shared/
        components/
          Header.tsx ← AdminLayout.tsx
          MatrixBackground.tsx ← BirimSelection.tsx, LoginPage.tsx
          ProtectedRoute.tsx ← App.tsx
        layouts/
          AdminLayout.tsx ← App.tsx
          AppSidebar.tsx ← AdminLayout.tsx
      store/
        authStore.ts ← usePermission.ts, Header.tsx, ProtectedRoute.tsx +8 more
      types/
        api/
          birims.ts ← birimsApi.ts, AnnouncementEditor.tsx, DepartmentList.tsx +1 more
          roles.ts ← rolesApi.ts, AnnouncementEditor.tsx, RolePermissions.tsx +1 more
          unvans.ts ← unvansApi.ts, UnvanList.tsx, UserCreate.tsx +1 more
          users.ts ← usersApi.ts, AnnouncementEditor.tsx, UserEdit.tsx
        index.ts ← App.tsx
    tailwind.config.js
    testsprite_tests/ [19 files: 15 .py, 2 .json, 1 .html]
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
  scripts/
    PostgreSQLBackup.ps1
```


## File Dependencies

> Scanned 152 files

### High-Impact Files

*Files imported by multiple other files:*

| File | Imported by |
|------|-------------|
| `src/lib/utils` | 59 files |
| `src/components/ui/button` | 20 files |
| `playwright/async_api` | 15 files |
| `asyncio` | 15 files |
| `intranet-portal/frontend/src/api/apiClient` | 14 files |


---

*Auto-generated by Maestro session hooks.*
