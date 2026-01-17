# Product Guide: Kurumsal İntranet Web Portalı

## Initial Concept

**Goal:** To provide a secure, centralized, and modular web-based intranet portal for corporate communication, document management, and unit-specific operations, enhancing efficiency and collaboration across the organization.

## 1. Target Audience & Roles

*   **Standard Employees:** Access to corporate announcements, personal profile management, document viewing, and unit-specific dashboards based on their assignment.
*   **Unit Managers:** Oversight of department-specific modules, management of unit personnel, and approval workflows.
*   **System Administrators:** Full control over user management (RBAC), security configurations (IP whitelisting), system monitoring (audit logs), and infrastructure maintenance.
*   **HR Specialists:** Management of employee records, organization structure, and personnel-related processes.

## 2. Core Features

*   **Secure Authentication & Authorization:**
    *   JWT-based authentication with HttpOnly cookies.
    *   Role-Based Access Control (RBAC) with granular permissions.
    *   IP Whitelisting for restricted access.
*   **User & Unit Management:**
    *   Comprehensive employee directory and profile management.
    *   Hierarchical unit/department structure.
    *   Multi-unit assignment capabilities.
*   **Communication Hub:**
    *   Announcement system with modal, banner, and dashboard notifications.
    *   Rich text editing for content creation.
*   **Document Management:**
    *   Secure file upload and categorization.
    *   Role-based download and viewing permissions.
*   **System Maintenance:**
    *   Database maintenance tools (Vacuum, Analyze).
    *   Backup management (Trigger & Download).
    *   Audit logging for compliance and tracking.

## 3. User Experience (UX)

*   **Modern & Responsive Interface:** Built with React 19 and TailwindCSS for a seamless experience across devices.
*   **Theme Support:** Native Dark Mode support for user preference.
*   **Performance Focused:** Real-time dashboards and optimized API interactions using .NET 9.
*   **Accessibility:** Adhering to accessibility standards for inclusive use.

## 4. Success Metrics

*   **Adoption Rate:** Percentage of employees actively using the portal daily.
*   **System Uptime:** High availability and reliability of the platform.
*   **Security Compliance:** Zero critical vulnerabilities and adherence to OWASP Top 10 standards.
*   **Operational Efficiency:** Reduction in manual processes and email-based workflows.
