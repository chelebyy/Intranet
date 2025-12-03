# Session Checkpoint: Birim/Modül Refactoring (Paused)

**Date:** 2025-12-04
**Status:** In Progress / Paused
**Topic:** Transitioning from dynamic "Birim" creation to static "System Modules".

## 📋 Summary
Started the refactoring process to map "Birimler" directly to system modules (IT, Test-Unit). The goal is to prevent manual unit creation and rely on code-defined modules.

## 🛠️ Changes Applied

### Backend
1.  **`Domain/Constants/SystemModules.cs`**
    *   Updated constant values to Turkish:
        *   `IT` -> `"Bilgi İşlem"`
        *   `TestUnit` -> `"Test Birimi"`

2.  **`Infrastructure/Data/Seeding/DatabaseSeeder.cs`**
    *   Updated `SeedSystemModulesAsync` to:
        *   Migrate existing "IT" and "Test-Unit" records to new Turkish names.
        *   Ensure descriptions are updated.

3.  **`API/Controllers/BirimlerController.cs`**
    *   `Create` endpoint: Now returns `BadRequest` with a message stating manual creation is disabled.

### Frontend
1.  **`features/admin/pages/DepartmentList.tsx`**
    *   Removed the "Yeni Birim" (New Unit) button.

## ⏳ Pending / Next Steps
The following items were in the plan but **NOT** yet executed (Work paused):

1.  **Frontend Cleanup (`DepartmentList.tsx`)**
    *   Remove "Pasife Al" button.
    *   Remove unused code (`handleDeactivate`, `openCreateModal`).
    *   Clean up imports.

2.  **Sandbox Cleanup (`/test`)**
    *   Remove `/test` route from `App.tsx`.
    *   Remove "Test Sayfası" link from `AppSidebar.tsx`.

3.  **Verification**
    *   Verify `AppSidebar.tsx` logic handles the new Turkish names (`selectedBirim?.birimAdi === 'Bilgi İşlem'`).

## 📝 Notes
*   User requested to pause operations ("hiçbişi yapma bekle").
*   The system is currently in a hybrid state (Backend updated, Frontend partially updated).
