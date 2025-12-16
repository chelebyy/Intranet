import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH_USERNAME = "00001"
AUTH_PASSWORD = "Admin123!"
TIMEOUT = 30

def test_auditlog_api_logging_and_retrieval():
    auth = HTTPBasicAuth(AUTH_USERNAME, AUTH_PASSWORD)
    headers = {
        "Accept": "application/json"
    }

    # Step 1: Perform a critical operation to generate an audit log
    # We'll simulate creating a dummy user as a critical operation.
    # Create user endpoint: POST /api/users
    user_payload = {
        "sicilNo": "TEMP12345",
        "name": "Audit Test",
        "surname": "User",
        "email": "audit.test.user@example.com",
        "password": "TempPass123!",
        "roleId": None,
        "departmentId": None
    }

    created_user_id = None
    try:
        create_user_resp = requests.post(
            f"{BASE_URL}/api/users",
            auth=auth,
            headers={**headers, "Content-Type": "application/json"},
            json=user_payload,
            timeout=TIMEOUT
        )
        assert create_user_resp.status_code == 201, f"Expected 201 Created, got {create_user_resp.status_code}"
        created_user = create_user_resp.json()
        created_user_id = created_user.get("id") or created_user.get("userId")

        assert created_user_id is not None, "Created user ID not found in response"

        # Step 2: Retrieve audit logs and verify the operation was logged
        # Audit log retrieval endpoint: GET /api/auditlog
        audit_resp = requests.get(
            f"{BASE_URL}/api/auditlog",
            auth=auth,
            headers=headers,
            timeout=TIMEOUT
        )
        assert audit_resp.status_code == 200, f"Expected 200 OK, got {audit_resp.status_code}"
        audit_logs = audit_resp.json()
        assert isinstance(audit_logs, list), "Audit logs response should be a list"

        # Validate that the audit log contains an entry corresponding to the user creation
        matching_logs = []
        for log in audit_logs:
            # Assuming audit log contains fields like 'operation', 'entity', 'entityId', 'user', 'timestamp'
            if (
                ("create" in log.get("operation", "").lower() or "created" in log.get("operation", "").lower())
                and (str(created_user_id) == str(log.get("entityId")) or log.get("entity") == "User")
            ):
                matching_logs.append(log)

        assert matching_logs, f"No audit log entry found for the created user ID {created_user_id}"

    finally:
        # Cleanup the user created for the test
        if created_user_id:
            delete_resp = requests.delete(
                f"{BASE_URL}/api/users/{created_user_id}",
                auth=auth,
                headers=headers,
                timeout=TIMEOUT
            )
            # Accept 204 No Content or 200 OK for successful delete
            assert delete_resp.status_code in (200, 204), f"Failed to delete test user, status code: {delete_resp.status_code}"

test_auditlog_api_logging_and_retrieval()