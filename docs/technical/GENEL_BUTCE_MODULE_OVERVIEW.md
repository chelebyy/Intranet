# Genel Bütçe Module Overview

**Status:** Initial Prototype
**Date:** 2025-12-04

## Purpose
The Genel Bütçe Module serves the "Genel Bütçe" department. It provides an overview of financial status, budget usage, and requests.

## Current Implementation
- **Dashboard:** `/genel-butce/dashboard` - Shows summary stats (Total Budget, Spent Amount, Pending Requests, Budget Growth).

## Integration
- **Routing:** Protected routes added to `App.tsx`.
- **Header:** Unit switcher logic updated to redirect to `/genel-butce/dashboard` when "Genel Bütçe" is selected.

## Next Steps
1. Implement Backend APIs (`GenelButceController`, `GenelButceService`).
2. Create Database Tables (`GB_Butce`, `GB_Talep`).
3. Connect Frontend to Real APIs.
4. Add "Talepler" and "Raporlar" pages.
