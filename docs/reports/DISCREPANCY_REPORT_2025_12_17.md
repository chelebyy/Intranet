# Documentation vs. Implementation Discrepancy Report
**Date:** 2025-12-17
**Status:** Analysis Complete

## 1. Executive Summary
A comprehensive scan of the project documentation against the actual file structure reveals that while the core architecture adheres to the design, several key documentation files are outdated. Specifically, `PROJECT_STRUCTURE.md` does not reflect the current state of backend development (Controllers are implemented, not empty) or the expansion of frontend feature modules.

## 2. Critical Discrepancies

### 2.1. `intranet-portal/PROJECT_STRUCTURE.md`
*   **Status:** 🔴 **Significantly Outdated** (Last update listed: 2025-11-25)
*   **Backend:** Lists `IntranetPortal.API/Controllers/` as "🚧 Empty Folders".
    *   **Actual:** Contains 12 fully implemented controllers (e.g., `MaintenanceController.cs`, `BackupController.cs`, `AnnouncementsController.cs`).
*   **Frontend:** Fails to list new feature modules found in `src/features/`.
    *   **Missing:** `genelButce`, `it`, `test-unit`.
    *   **Lists only:** `auth`, `admin`.

### 2.2. `docs/api/API_SPECIFICATION.md`
*   **Status:** 🟡 **Partially Outdated**
*   **Missing Endpoints:** The following active controllers likely lack full detailed specification in the current doc:
    *   `MaintenanceController.cs` (Database maintenance, vacuum, reindex)
    *   `BackupController.cs` (Backup operations)
    *   `IPRestrictionsController.cs` (IP Whitelisting management details)
*   **Recommendation:** Update spec to include full contracts for Maintenance and Backup modules.

### 2.3. `docs/general/PRD.md`
*   **Status:** 🟢 **Mostly Current (High Level)**
*   **Alignment:** The "Multi-Unit" requirement (FR-16) is implemented via the specific modules (`it`, `genelButce`), which verifies the PRD is being followed, even if specific module names aren't in the generic PRD.

## 3. Implementation Verification

### Backend (`IntranetPortal.API`)
| Component | Documented? | Implemented? | Notes |
|-----------|-------------|--------------|-------|
| `AnnouncementsController` | ✅ Yes | ✅ Yes | Fully aligned. |
| `UsersController` | ✅ Yes | ✅ Yes | Fully aligned. |
| `MaintenanceController` | ❌ No | ✅ Yes | **Undocumented Feature.** |
| `BackupController` | ❌ No | ✅ Yes | **Undocumented Feature.** |
| `UnvanlarController` | ❌ No | ✅ Yes | **Undocumented Feature.** |

### Frontend (`src/features`)
| Module | Documented? | Implemented? | Notes |
|--------|-------------|--------------|-------|
| `auth` | ✅ Yes | ✅ Yes | Matrix login implemented. |
| `admin` | ✅ Yes | ✅ Yes | Dashboard & User mgmt. |
| `it` | ❌ No | ✅ Yes | **New Module** (IT Dept specific). |
| `genelButce` | ❌ No | ✅ Yes | **New Module** (General Budget). |
| `test-unit` | ❌ No | ✅ Yes | **New Module** (Testing). |

## 4. Recommendations
1.  **Update `PROJECT_STRUCTURE.md`:** immediately to reflect the populated Controllers and new Frontend modules.
2.  **Revise `API_SPECIFICATION.md`:** Add sections for `Maintenance` and `Backup` APIs.
3.  **Archive:** Consider archiving older "Checkpoint" documents in `docs/sessions/` to reduce noise.

## 5. Summary of New/Unlisted Files
*   `backend/IntranetPortal.Domain/Entities/AnnouncementTarget.cs`
*   `backend/IntranetPortal.Domain/Entities/UserAcknowledgment.cs`
*   `backend/IntranetPortal.Domain/Entities/SystemSettings.cs`

These files indicate refined requirements (likely for acknowledging announcements or targeting specific users functionality) that were added after the initial design phase.
