# Auth Test Contracts

> Authentication & Authorization Test Contract Documentation  
> Generated: 2026-04-03  
> Scope: Login flow, JWT validation, permissions, session management

---

## Table of Contents

1. [Auth Flow Overview](#1-auth-flow-overview)
2. [Login Flow Tests](#2-login-flow-tests)
3. [JWT Validation Tests](#3-jwt-validation-tests)
4. [Permission Test Matrix](#4-permission-test-matrix)
5. [Cookie Security Requirements](#5-cookie-security-requirements)
6. [API Error Handling](#6-api-error-handling)
7. [Logout Flow Tests](#7-logout-flow-tests)

---

## 1. Auth Flow Overview

### 1.1 Happy Path Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AUTHENTICATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │  User Input  │
     │ Sicil + Pwd  │
     └──────┬───────┘
            │
            ▼
     ┌────────────────────────────────────────────────────┐
     │ POST /api/auth/login                               │
     │ { sicil: "12345", password: "***" }               │
     └──────────────┬─────────────────────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
     ┌──────▼──────┐ ┌──────▼──────┐
     │  Success    │ │  Invalid    │
     │  Response   │ │  Credentials│
     └──────┬──────┘ └──────┬──────┘
            │               │
            ▼               ▼
     ┌──────────────┐ ┌──────────────┐
     │ Set Cookie   │ │ Return 401   │
     │ auth_token   │ │ Invalid      │
     │ HttpOnly     │ │ credentials  │
     └──────┬───────┘ └──────────────┘
            │
     ┌──────┴────────────────┐
     │                       │
┌────▼───────┐      ┌────────▼─────────┐
│  Single    │      │  Multiple Birims │
│  Birim     │      │  requiresBirim:  │
│  Selected  │      │  true            │
└────┬───────┘      └────────┬─────────┘
     │                       │
     ▼                       ▼
┌─────────────────┐  ┌─────────────────────┐
│ Continue to     │  │ Redirect to         │
│ /dashboard      │  │ /select-birim       │
│                 │  │                     │
└─────────────────┘  └─────────────────────┘
```

### 1.2 Session Validation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SESSION VALIDATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐
  │  API Request     │
  │  with Cookie     │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────────────────────────┐
  │  1. Check auth_token cookie          │
  │  2. Validate JWT signature           │
  │  3. Check expiration                 │
  └──────────┬───────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼────┐     ┌─────▼──────┐
│ Valid   │     │ Invalid/   │
│ Token   │     │ Expired    │
└────┬────┘     └─────┬──────┘
     │                │
     ▼                ▼
┌─────────────────┐ ┌─────────────────┐
│ Check X-Birim-  │ │ Return 401      │
│ Id Header       │ │ Unauthorized    │
└────┬────────────┘ └─────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Query by UserID AND BirimID         │
│ (Multi-tenant security)             │
└─────────────────────────────────────┘
```

### 1.3 Permission Check Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PERMISSION CHECK FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌────────────────────┐
  │ Protected Endpoint │
  │ [HasPermission]    │
  └────────┬───────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │ 1. Extract roleId from JWT      │
  │ 2. Check if roleId == 1         │
  │    (SuperAdmin bypass)          │
  └────────┬────────────────────────┘
           │
     ┌─────┴────────┐
     │              │
┌────▼───┐    ┌─────▼────────┐
│Super   │    │ Regular User │
│Admin   │    │              │
└────┬───┘    └─────┬────────┘
     │              │
     │              ▼
     │     ┌────────────────────────┐
     │     │ Check UserBirimRoles   │
     │     │ WHERE UserID = X       │
     │     │   AND BirimID = Y      │
     │     │ Get Role permissions   │
     │     └────────┬───────────────┘
     │              │
     │              ▼
     │     ┌────────────────────────┐
     │     │ Does permission list   │
     │     │ contain required?      │
     │     └────────┬───────────────┘
     │              │
     │      ┌───────┴────────┐
     │      │                │
     │ ┌────▼───┐     ┌──────▼─────┐
     │ │  Yes   │     │    No      │
     │ └───┬────┘     └──────┬─────┘
     │     │                 │
     │     │                 ▼
     │     │        ┌───────────────┐
     │     │        │ Return 403    │
     │     │        │ Forbidden     │
     │     │        └───────────────┘
     └─────┴─────────────┐
                       │
                       ▼
              ┌─────────────────┐
              │ Execute Action  │
              └─────────────────┘
```

---

## 2. Login Flow Tests

### 2.1 Login Endpoint Contract

```yaml
Endpoint: POST /api/auth/login
Content-Type: application/json
```

#### Request Schema

```typescript
interface LoginRequestDto {
  sicil: string;      // Required, 1-50 chars
  password: string;   // Required, 1-100 chars
}
```

#### Success Response (200 OK)

```typescript
interface LoginResponseDto {
  user: {
    userId: number;
    sicil: string;
    ad: string;
    soyad: string;
    email?: string;
  };
  birimler: BirimDto[];           // All accessible birims
  selectedBirim: BirimDto | null; // First birim or null
  selectedRole: RoleDto | null;   // Role for selected birim
  requiresBirimSelection: boolean;
}

// Response Headers:
// Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/
```

### 2.2 Test Scenarios

#### TC-LOGIN-001: Valid Credentials

```gherkin
Feature: Login with valid credentials

  Scenario: User logs in with correct credentials
    Given a user exists with:
      | sicil    | 12345         |
      | password | CorrectPass1! |
      | isActive | true          |
    And the user has at least one active birim assignment
    When I POST to /api/auth/login with:
      """
      {
        "sicil": "12345",
        "password": "CorrectPass1!"
      }
      """
    Then response status should be 200
    And response should contain valid user data
    And response should contain birimler array
    And response header "Set-Cookie" should contain "auth_token"
    And cookie should have attributes:
      | HttpOnly | true          |
      | Secure   | false (dev)   |
      | SameSite | Lax (dev)     |
      | Path     | /             |
```

#### TC-LOGIN-002: Invalid Password

```gherkin
Feature: Login with invalid password

  Scenario: User provides incorrect password
    Given a user exists with:
      | sicil    | 12345         |
      | password | CorrectPass1! |
      | isActive | true          |
    When I POST to /api/auth/login with:
      """
      {
        "sicil": "12345",
        "password": "WrongPass123!"
      }
      """
    Then response status should be 401
    And response body should be:
      """
      {
        "success": false,
        "message": "Invalid credentials",
        "errorCode": "INVALID_CREDENTIALS"
      }
      """
    And response should NOT contain "Set-Cookie" header
```

#### TC-LOGIN-003: Non-existent User

```gherkin
Feature: Login with non-existent user

  Scenario: Sicil number does not exist
    Given no user exists with sicil "99999"
    When I POST to /api/auth/login with:
      """
      {
        "sicil": "99999",
        "password": "AnyPassword123!"
      }
      """
    Then response status should be 401
    And response body should indicate invalid credentials
    And response should NOT contain "Set-Cookie" header
```

#### TC-LOGIN-004: Inactive User

```gherkin
Feature: Login with inactive user

  Scenario: User account is deactivated
    Given a user exists with:
      | sicil    | 12345         |
      | password | CorrectPass1! |
      | isActive | false         |
    When I POST to /api/auth/login with valid credentials
    Then response status should be 401
    And response should indicate account is inactive
    And response should NOT contain "Set-Cookie" header
```

#### TC-LOGIN-005: User Without Birim Assignment

```gherkin
Feature: Login with no birim assignment

  Scenario: Active user has no birim assignments
    Given a user exists with:
      | sicil    | 12345         |
      | password | CorrectPass1! |
      | isActive | true          |
    And the user has NO birim assignments
    When I POST to /api/auth/login with valid credentials
    Then response status should be 403
    And response should indicate no birim access
    And response should NOT contain "Set-Cookie" header
```

#### TC-LOGIN-006: Multiple Birims - Selection Required

```gherkin
Feature: Login with multiple birims

  Scenario: User belongs to multiple birims
    Given a user exists with active birim assignments:
      | birimId | birimAdi    | roleId | roleName  |
      | 1       | IT          | 2      | Admin     |
      | 2       | HR          | 3      | User      |
      | 3       | Finance     | 3      | User      |
    When I POST to /api/auth/login with valid credentials
    Then response status should be 200
    And response should contain 3 birimler
    And requiresBirimSelection should be true
    And selectedBirim should be the first birim
```

#### TC-LOGIN-007: Single Birim - Auto Select

```gherkin
Feature: Login with single birim

  Scenario: User belongs to exactly one birim
    Given a user exists with single birim assignment:
      | birimId | birimAdi | roleId | roleName |
      | 1       | IT       | 2      | Admin    |
    When I POST to /api/auth/login with valid credentials
    Then response status should be 200
    And birimler should contain 1 item
    And requiresBirimSelection should be false
    And selectedBirim should be pre-populated
    And selectedRole should be pre-populated
```

#### TC-LOGIN-008: Rate Limiting

```gherkin
Feature: Login rate limiting

  Scenario: Too many failed login attempts
    Given rate limit is 5 attempts per minute
    When I POST to /api/auth/login with invalid credentials 6 times
    Then the 6th response should be 429
    And response should indicate rate limit exceeded
    And response header "Retry-After" should be present
```

#### TC-LOGIN-009: SQL Injection Attempt

```gherkin
Feature: Login security - SQL injection

  Scenario: Attempt SQL injection in sicil field
    When I POST to /api/auth/login with:
      """
      {
        "sicil": "'; DROP TABLE Users; --",
        "password": "anything"
      }
      """
    Then response status should be 401
    And database should remain intact
    And no exception should be logged as 500 error
```

---

## 3. JWT Validation Tests

### 3.1 JWT Structure Contract

```yaml
Algorithm: HS256 (HMAC-SHA256)
Token Type: JWT
Expiry: 8 hours from issuance
Issuer: IntranetPortal
Audience: IntranetPortal
```

#### Expected Claims

```typescript
interface JwtClaims {
  // Subject identification
  sub: string;           // UserID as string
  userId: number;        // Same as sub (numeric)
  sicil: string;         // Employee number
  
  // User information
  ad: string;            // First name
  soyad: string;         // Last name
  
  // Birim context
  birimId: number;       // Current organizational unit
  birimAdi: string;      // Birim name
  
  // Role information
  roleId: number;        // Current role in birim
  roleName: string;      // Role name
  
  // Standard JWT claims
  jti: string;           // Unique token ID
  iat: number;           // Issued at (Unix timestamp)
  exp: number;           // Expiration (Unix timestamp)
  iss: string;           // Issuer
  aud: string;           // Audience
}
```

### 3.2 JWT Test Cases

#### TC-JWT-001: Token Generation

```gherkin
Feature: JWT token generation

  Scenario: Valid login generates valid JWT
    Given user "12345" logs in successfully
    When I decode the auth_token cookie
    Then token should be valid JWT format
    And token header should specify alg: "HS256"
    And all required claims should be present
```

#### TC-JWT-002: Token Expiration

```gherkin
Feature: JWT token expiration

  Scenario: Token expires after 8 hours
    Given a valid JWT token issued at time T
    Then token exp claim should equal T + 8 hours
    When 8 hours and 1 minute passes
    And I make API request with expired token
    Then response should be 401
    And response should indicate token expired
```

#### TC-JWT-003: Token Signature Validation

```gherkin
Feature: JWT signature validation

  Scenario: Tampered token is rejected
    Given a valid JWT token
    When I modify the payload claim "roleId" from 3 to 1
    And I make API request with tampered token
    Then response should be 401
    And response should indicate invalid token
```

#### TC-JWT-004: Missing Claims

```gherkin
Feature: JWT claim validation

  Scenario Outline: Required claims must be present
    Given a JWT token missing "<claim>"
    When I make API request with incomplete token
    Then response should be 401

    Examples:
      | claim     |
      | userId    |
      | sicil     |
      | birimId   |
      | roleId    |
```

#### TC-JWT-005: Wrong Signing Key

```gherkin
Feature: JWT signing key validation

  Scenario: Token signed with wrong key is rejected
    Given a JWT token signed with "wrong-secret-key"
    When I make API request with this token
    Then response should be 401
    And response should indicate signature validation failed
```

---

## 4. Permission Test Matrix

### 4.1 Permission Format Contract

```yaml
Format: "action.resource"
Delimiter: Dot (.)
Case: Lowercase

Examples:
  - "user.create"
  - "user.read"
  - "user.update"
  - "user.delete"
  - "role.create"
  - "birim.read"
  - "permission.assign"
```

### 4.2 Permission Test Matrix

| Test ID | Role | Birim | Permission Required | Expected Result | Notes |
|---------|------|-------|---------------------|-----------------|-------|
| TC-PERM-001 | SuperAdmin (1) | Any | Any | ✅ Allow | Bypass all checks |
| TC-PERM-002 | Admin (2) | IT | "user.create" | ✅ Allow | Has permission in IT |
| TC-PERM-003 | User (3) | IT | "user.create" | ❌ Deny (403) | No permission |
| TC-PERM-004 | Admin (2) | HR | "user.create" | ❌ Deny (403) | Wrong birim context |
| TC-PERM-005 | Admin (2) | IT | "user.read" | ✅ Allow | Has permission |
| TC-PERM-006 | Admin (2) | IT | "role.delete" | ❌ Deny (403) | Insufficient permission |
| TC-PERM-007 | User (3) | HR | "user.read" | ✅ Allow | Basic read allowed |
| TC-PERM-008 | Guest (4) | IT | "user.read" | ❌ Deny (403) | No permissions |
| TC-PERM-009 | User (3) | IT | "birim.switch" | ✅ Allow | Can switch own birim |
| TC-PERM-010 | Admin (2) | IT | "permission.grant" | ❌ Deny (403) | Only SuperAdmin |

### 4.3 Permission Attribute Contract

```csharp
// Backend usage
[HttpPost]
[HasPermission("user.create")]
public async Task<ActionResult> CreateUser(CreateUserDto dto)
{
    // Implementation
}

// Frontend usage
const { hasPermission } = usePermission();
if (hasPermission('user', 'create')) {
    // Show create button
}
```

### 4.4 Permission Test Scenarios

#### TC-PERM-011: SuperAdmin Bypass

```gherkin
Feature: SuperAdmin permission bypass

  Scenario: SuperAdmin can access any endpoint
    Given a user with roleId = 1 (SuperAdmin)
    And the user has NO explicit permissions assigned
    When the user requests any protected endpoint
    Then access should be granted
    And no permission checks should query the database
```

#### TC-PERM-012: Multi-Birim Context Switch

```gherkin
Feature: Permission in different birim context

  Scenario: User has different permissions per birim
    Given a user exists with assignments:
      | birimId | birimAdi | roleId | roleName | permissions               |
      | 1       | IT       | 2      | Admin    | user.create, user.read    |
      | 2       | HR       | 3      | User     | user.read                 |
    And user is currently in birim IT
    When user requests "user.create"
    Then access should be granted
    When user switches to birim HR
    And user requests "user.create"
    Then access should be denied (403)
```

---

## 5. Cookie Security Requirements

### 5.1 Cookie Contract

```yaml
Cookie Name: auth_token
Type: HttpOnly Cookie (NOT localStorage/sessionStorage)
Size: ~500-800 bytes (JWT payload dependent)
```

#### Development Environment

```
Set-Cookie: auth_token=<jwt>;
  HttpOnly;
  Secure=false;
  SameSite=Lax;
  Path=/;
  Max-Age=28800
```

#### Production Environment

```
Set-Cookie: auth_token=<jwt>;
  HttpOnly;
  Secure=true;
  SameSite=Strict;
  Path=/;
  Max-Age=28800
```

### 5.2 Security Test Cases

#### TC-COOKIE-001: HttpOnly Flag

```gherkin
Feature: Cookie HttpOnly flag

  Scenario: Token cannot be accessed via JavaScript
    Given user has logged in successfully
    When I execute "document.cookie" in browser console
    Then auth_token should NOT be visible
    And "HttpOnly" flag should prevent JavaScript access
```

#### TC-COOKIE-002: XSS Protection

```gherkin
Feature: XSS cannot steal token

  Scenario: Stored XSS attempt fails to extract token
    Given an attacker injects "<script>alert(document.cookie)</script>"
    When payload executes in victim's browser
    Then auth_token should NOT appear in alert
    And cookie HttpOnly flag prevents access
```

#### TC-COOKIE-003: CSRF Protection

```gherkin
Feature: CSRF token validation

  Scenario: Cross-origin request without proper headers
    Given user is logged in
    When a malicious site makes POST request to /api/users
    Then request should be rejected
    And SameSite cookie attribute should block the request
```

#### TC-COOKIE-004: Secure Flag (Production)

```gherkin
Feature: Secure cookie flag in production

  Scenario: Cookie only transmitted over HTTPS
    Given production environment
    When login request completes
    Then Set-Cookie should have "Secure" flag
    And cookie should NOT be sent over HTTP
```

#### TC-COOKIE-005: Cookie Scope

```gherkin
Feature: Cookie path and domain scope

  Scenario: Cookie is scoped correctly
    Given user logs in at https://portal.company.com
    Then cookie Path should be "/"
    And cookie Domain should be "portal.company.com"
    And cookie should NOT be sent to other domains
```

---

## 6. API Error Handling

### 6.1 Error Response Contract

```typescript
interface ApiErrorResponse {
  success: false;
  message: string;      // Human-readable message
  errorCode: string;    // Machine-readable error code
  details?: object;     // Optional additional details
  timestamp: string;    // ISO 8601 timestamp
  path?: string;        // Request path
}
```

### 6.2 Error Code Reference

| Status | Error Code | Scenario | Frontend Action |
|--------|------------|----------|-----------------|
| 400 | VALIDATION_ERROR | Invalid request format | Show field errors |
| 401 | INVALID_CREDENTIALS | Wrong username/password | Show login error |
| 401 | TOKEN_EXPIRED | JWT expired | Redirect to login |
| 401 | TOKEN_INVALID | JWT malformed | Redirect to login |
| 403 | INSUFFICIENT_PERMISSION | No permission for action | Show access denied |
| 403 | NO_BIRIM_ACCESS | User has no birim assignments | Show error page |
| 404 | RESOURCE_NOT_FOUND | Entity doesn't exist | Show 404 page |
| 409 | DUPLICATE_ENTRY | Unique constraint violation | Show conflict error |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests | Show retry after timer |
| 500 | INTERNAL_ERROR | Unexpected server error | Show generic error |

### 6.3 Error Handling Test Scenarios

#### TC-ERROR-001: Token Expired Flow

```gherkin
Feature: Handle expired token

  Scenario: User session expires during activity
    Given user has valid session
    And token expires while user is on dashboard
    When user clicks "Create User" button
    Then API returns 401 with errorCode "TOKEN_EXPIRED"
    And frontend should redirect to /login
    And toast notification should show "Session expired"
```

#### TC-ERROR-002: Permission Denied Flow

```gherkin
Feature: Handle permission denied

  Scenario: User attempts unauthorized action
    Given user with role "User" is logged in
    When user navigates to /admin/users
    Then API returns 403 with errorCode "INSUFFICIENT_PERMISSION"
    And frontend should show AccessDenied component
    And "Go Back" button should be visible
```

#### TC-ERROR-003: Network Failure

```gherkin
Feature: Handle network errors

  Scenario: API server is unreachable
    Given backend is down
    When user attempts to login
    Then frontend should detect network error
    And show "Connection failed" message
    And "Retry" button should be available
```

#### TC-ERROR-004: Rate Limit Response

```gherkin
Feature: Handle rate limiting

  Scenario: Too many requests
    Given user makes 101 API calls in 1 minute
    When 102nd request is made
    Then API returns 429
    And response header "Retry-After" = 60
    And frontend should queue requests or show countdown
```

---

## 7. Logout Flow Tests

### 7.1 Logout Endpoint Contract

```yaml
Endpoint: POST /api/auth/logout
Authentication: Required (valid token)
```

#### Success Response (200 OK)

```typescript
// Response Headers:
// Set-Cookie: auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0

interface LogoutResponseDto {
  success: true;
  message: "Logged out successfully";
}
```

### 7.2 Logout Test Scenarios

#### TC-LOGOUT-001: Successful Logout

```gherkin
Feature: User logout

  Scenario: User logs out successfully
    Given user is logged in with valid session
    When I POST to /api/auth/logout
    Then response status should be 200
    And response should indicate success
    And Set-Cookie header should clear auth_token
    And auth_token cookie should have Max-Age=0
```

#### TC-LOGOUT-002: Token Invalidation

```gherkin
Feature: Token invalidation after logout

  Scenario: Logged out token cannot be reused
    Given user has logged out
    When I make API request with the old token
    Then response should be 401
    And response should indicate token is invalid
```

#### TC-LOGOUT-003: Audit Log Entry

```gherkin
Feature: Logout audit trail

  Scenario: Logout creates audit log
    Given user "12345" logs out
    Then AuditLog table should contain entry:
      | Action    | LOGOUT                |
      | UserID    | <user_id>             |
      | BirimID   | <current_birim_id>    |
      | IPAddress | <client_ip>           |
      | Timestamp | <current_time>        |
```

#### TC-LOGOUT-004: Frontend State Cleanup

```gherkin
Feature: Frontend state cleanup

  Scenario: Zustand store is cleared on logout
    Given user is logged in
    When logout is triggered
    Then Zustand authStore should be reset:
      | user              | null |
      | isAuthenticated   | false |
      | selectedBirim     | null |
      | selectedRole      | null |
    And user should be redirected to /login
```

---

## Appendix A: Test Data Fixtures

### A.1 User Fixtures

```json
{
  "validUser": {
    "sicil": "12345",
    "password": "TestPass123!",
    "ad": "Test",
    "soyad": "User",
    "isActive": true
  },
  "inactiveUser": {
    "sicil": "99999",
    "password": "TestPass123!",
    "isActive": false
  },
  "multiBirimUser": {
    "sicil": "54321",
    "password": "TestPass123!",
    "birims": [
      { "id": 1, "ad": "IT", "roleId": 2 },
      { "id": 2, "ad": "HR", "roleId": 3 }
    ]
  },
  "superAdmin": {
    "sicil": "00001",
    "password": "AdminPass123!",
    "roleId": 1
  }
}
```

### A.2 Permission Fixtures

```json
{
  "permissionsByRole": {
    "1": ["*"],
    "2": ["user.create", "user.read", "user.update", "birim.read"],
    "3": ["user.read", "birim.switch"],
    "4": []
  }
}
```

---

## Appendix B: Integration Test Checklist

### Pre-Flight Checklist

- [ ] Database seeded with test fixtures
- [ ] Backend API running
- [ ] JWT secret configured
- [ ] Rate limiting configured
- [ ] CORS enabled for test domain

### Run Order

1. **Login Flow Tests** (TC-LOGIN-*)
2. **JWT Validation Tests** (TC-JWT-*)
3. **Permission Matrix Tests** (TC-PERM-*)
4. **Cookie Security Tests** (TC-COOKIE-*)
5. **Error Handling Tests** (TC-ERROR-*)
6. **Logout Flow Tests** (TC-LOGOUT-*)

### Expected Duration

- Full suite: ~5-10 minutes
- Smoke tests only: ~1 minute
- Permission matrix: ~2 minutes

---

*Document Version: 1.0*  
*Last Updated: 2026-04-03*  
*Maintainer: DevOps Team*
