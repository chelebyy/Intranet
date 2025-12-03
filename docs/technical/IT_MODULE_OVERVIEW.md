# IT Module Overview

**Status:** Initial Prototype
**Date:** 2025-12-03

## Purpose
The IT Module serves the "Bilgi İşlem" department. It allows tracking of technical issues (Arıza Kayıtları) and inventory (Envanter).

## Current Implementation
- **Dashboard:** `/it/dashboard` - Shows summary stats.
- **Arıza List:** `/it/ariza` - Placeholder for issue tracking.

## Integration
- **Sidebar:** Menu items appear only when the selected unit is "Bilgi İşlem".
- **Routing:** Protected routes added to `App.tsx`.
- **Permissions:** Currently relies on unit context. Future iterations will enforce specific `it.*` permissions.

## Next Steps
1. Implement Backend APIs (`ITController`, `ITService`).
2. Create Database Tables (`IT_ArizaKayit`, `IT_Envanter`).
3. Connect Frontend to Real APIs.
