# Phase 4 Implementation Plan: Multi-Unit Navigation

## Overview
This document outlines the implementation steps for enabling multi-unit navigation in the Intranet Portal, based on the architectural decisions documented in **[DESIGN_MULTI_UNIT_NAV.md](./DESIGN_MULTI_UNIT_NAV.md)**.

## Objectives
- Enable seamless switching between user units (Birims) without re-login.
- Refactor the `AdminLayout` to use a modular `Header` component.
- Ensure the Sidebar and Dashboard reflect the selected unit's context dynamically.

## Implementation Tasks

### 1. Enhance `Header.tsx` Component
**Goal:** Transform the existing `Header` component into a full-featured navigation bar.

*   **Action Items:**
    *   Import `SidebarTrigger` from `@/components/ui/sidebar` to enable sidebar toggling.
    *   Import `Breadcrumb` components (`Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, etc.) from `@/components/ui/breadcrumb`.
    *   Migrate the `getPageTitle()` logic from `AdminLayout.tsx` to `Header.tsx` (or use `useLocation` hook internally) to display dynamic page titles.
    *   Integrate the `SidebarTrigger` on the left side of the header.
    *   Integrate the `Breadcrumb` navigation next to the trigger.
    *   Ensure the existing Unit Switcher (Dropdown) and User Menu remain functional on the right side.

### 2. Refactor `AdminLayout.tsx`
**Goal:** Clean up the main layout by delegating header responsibilities.

*   **Action Items:**
    *   Remove the entire inline `<header className="...">...</header>` block.
    *   Remove unused imports related to the inline header (e.g., Breadcrumb components if they are no longer used directly in layout).
    *   Import the updated `Header` component from `../components/Header`.
    *   Render `<Header />` inside the `<main>` container, above the content area.

### 3. Verification & Testing
**Goal:** Confirm the feature works as designed.

*   **Test Scenarios:**
    1.  **Initial Load:** Log in with a user assigned to multiple units. Confirm redirection to `/select-birim`.
    2.  **Context Display:** After selection, verify the Sidebar shows menus relevant to the selected unit.
    3.  **Switching:**
        *   Open the Header Dropdown.
        *   Select a different unit.
        *   Verify the "Birim değiştirildi" toast message appears.
        *   Verify the page redirects/reloads to `/dashboard`.
        *   **Critical:** Confirm the Sidebar menu items update immediately to reflect the new unit's permissions.
    4.  **Responsive Check:** Ensure the new Header layout (Trigger + Breadcrumb + Actions) works on mobile devices.

## References
*   [Technical Design: Multi-Unit Navigation](./DESIGN_MULTI_UNIT_NAV.md)
