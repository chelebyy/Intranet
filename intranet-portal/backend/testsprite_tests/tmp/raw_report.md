
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** backend
- **Date:** 2025-12-15
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** auth api login functionality
- **Test Code:** [TC001_auth_api_login_functionality.py](./TC001_auth_api_login_functionality.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 45, in <module>
  File "<string>", line 26, in test_auth_api_login_functionality
AssertionError: Expected 200 OK, got 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/9d7f2df9-fb6f-4761-a3e0-6ca3764bbb92
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** users api user management
- **Test Code:** [TC002_users_api_user_management.py](./TC002_users_api_user_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 106, in <module>
  File "<string>", line 33, in test_users_api_user_management
AssertionError: User creation failed: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/d697bcff-dae6-4908-b916-b44f6b48fe9d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** roles api role management
- **Test Code:** [TC003_roles_api_role_management.py](./TC003_roles_api_role_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 141, in <module>
  File "<string>", line 19, in test_roles_api_role_management
AssertionError: Failed to fetch permissions: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/1f958b50-511f-41d7-86f8-f17bba28a193
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** auditlog api logging and retrieval
- **Test Code:** [TC004_auditlog_api_logging_and_retrieval.py](./TC004_auditlog_api_logging_and_retrieval.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 79, in <module>
  File "<string>", line 37, in test_auditlog_api_logging_and_retrieval
AssertionError: Expected 201 Created, got 401

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/2acab1a6-49df-40c6-971f-116f6a020513
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** dashboard api statistics retrieval
- **Test Code:** [TC005_dashboard_api_statistics_retrieval.py](./TC005_dashboard_api_statistics_retrieval.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 47, in <module>
  File "<string>", line 20, in test_dashboard_api_statistics_retrieval
AssertionError: Expected status code 200, got 404

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/6dea2738-ea9c-4645-b8e5-5ca5b55ff047
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** ip restrictions api management
- **Test Code:** [TC006_ip_restrictions_api_management.py](./TC006_ip_restrictions_api_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 117, in <module>
  File "<string>", line 23, in test_ip_restrictions_api_management
AssertionError: Login failed with status 429: {"success":false,"error":{"code":"RATE_LIMIT_EXCEEDED","message":"Çok fazla giriş denemesi. Lütfen 9 saniye sonra tekrar deneyin.","retryAfter":9}}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/0c0f9918-898d-417e-9361-b06ab9b2e974
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** backup api database backup and restore
- **Test Code:** [TC007_backup_api_database_backup_and_restore.py](./TC007_backup_api_database_backup_and_restore.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 59, in <module>
  File "<string>", line 19, in test_backup_api_database_backup_and_restore
AssertionError: Failed to enable maintenance mode: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/5d0045b9-7fb3-4b98-8885-5bb37ea31794
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** birimler api department management
- **Test Code:** [TC008_birimler_api_department_management.py](./TC008_birimler_api_department_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 110, in <module>
  File "<string>", line 31, in test_birimler_api_department_management
AssertionError: Create failed: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/0b6e8ce6-05ee-4f72-92d6-5f6811f1888f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** unvanlar api title management
- **Test Code:** [TC009_unvanlar_api_title_management.py](./TC009_unvanlar_api_title_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 55, in <module>
  File "<string>", line 21, in test_unvanlar_api_title_management
AssertionError: Unvan creation failed: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/924f706a-85ec-444f-ab53-7d9fdc67841e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** permissions api permission management
- **Test Code:** [TC010_permissions_api_permission_management.py](./TC010_permissions_api_permission_management.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 138, in <module>
  File "<string>", line 29, in test_permissions_api_permission_management
AssertionError: Permission creation failed: 

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/a8c65138-bdfa-4662-ac9c-636d85b6c81d/8c561104-aae3-4005-9839-05c1a1b16784
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---