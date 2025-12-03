# Test Unit Module Overview

**Status:** Initial Prototype
**Date:** 2025-12-03

## Purpose
The Test Unit Module serves the "Test Birimi" (unit 'test'). It is designed to verify the multi-unit navigation and module isolation features.

## Current Implementation
- **Dashboard:** `/test-unit/dashboard` - Shows mock test statistics.
- **Test Cases:** `/test-unit/cases` - Placeholder for test case management.

## Integration
- **Sidebar:** Menu items appear only when the selected unit is "test" (BirimID: 4).
- **Routing:** Protected routes added to `App.tsx`.
- **User:** SuperAdmin (00001) is assigned to this unit with 'BirimAdmin' role.

## Verification
To verify module isolation:
1. Switch to "Bilgi İşlem" -> Verify IT menu appears, Test menu hidden.
2. Switch to "test" -> Verify Test menu appears, IT menu hidden.
