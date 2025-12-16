import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH = HTTPBasicAuth("00001", "Admin123!")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_roles_api_role_management():
    role_id = None

    # Fetch existing permissions to use in role creation
    permissions_resp = requests.get(
        f"{BASE_URL}/api/permissions",
        auth=AUTH,
        headers=HEADERS,
        timeout=TIMEOUT
    )
    assert permissions_resp.status_code == 200, f"Failed to fetch permissions: {permissions_resp.text}"
    permissions_list = permissions_resp.json()
    assert isinstance(permissions_list, list), "Permissions response is not a list"
    permission_ids = [p.get('id') for p in permissions_list if 'id' in p]
    assert permission_ids, "No permissions found to assign"

    # Role creation payload with at least one permission
    create_payload = {
        "name": "TestRole_TC003",
        "description": "Test role created for TC003 validation",
        "permissions": [permission_ids[0]]  # Use one existing permission
    }
    try:
        # Create role
        create_resp = requests.post(
            f"{BASE_URL}/api/roles",
            auth=AUTH,
            json=create_payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Role creation failed: {create_resp.text}"
        create_data = create_resp.json()
        assert "id" in create_data, "Created role response missing 'id'"
        role_id = create_data["id"]

        # Assign role to a user (need a user id, creating a dummy user to assign or checking existing user)
        users_resp = requests.get(
            f"{BASE_URL}/api/users",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert users_resp.status_code == 200, f"Failed to get users for role assignment: {users_resp.text}"
        users = users_resp.json()
        assert isinstance(users, list) and users, "Users list empty, cannot assign role"
        user_id = users[0].get("id")
        assert user_id, "Selected user missing 'id'"

        assign_payload = {"roleId": role_id}
        assign_resp = requests.post(
            f"{BASE_URL}/api/users/{user_id}/roles",
            auth=AUTH,
            json=assign_payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert assign_resp.status_code in (200, 204), f"Role assignment failed: {assign_resp.text}"

        # Update role
        update_payload = {
            "name": "TestRole_TC003_Updated",
            "description": "Updated description for TC003 test",
            "permissions": [permission_ids[0]]  # Keep same permission
        }
        update_resp = requests.put(
            f"{BASE_URL}/api/roles/{role_id}",
            auth=AUTH,
            json=update_payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert update_resp.status_code == 200, f"Role update failed: {update_resp.text}"
        updated_role = update_resp.json()
        assert updated_role.get("name") == "TestRole_TC003_Updated", "Role name did not update correctly"
        assert updated_role.get("description") == "Updated description for TC003 test", "Role description did not update correctly"

        # Retrieve role and verify data integrity
        get_resp = requests.get(
            f"{BASE_URL}/api/roles/{role_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_resp.status_code == 200, f"Failed to retrieve role after update: {get_resp.text}"
        role_data = get_resp.json()
        assert role_data["id"] == role_id, "Retrieved role id mismatch"
        assert role_data["name"] == "TestRole_TC003_Updated", "Retrieved role name mismatch"
        assert role_data["description"] == "Updated description for TC003 test", "Retrieved role description mismatch"

        # Check access restriction enforcement: try to create role without auth should fail
        unauth_resp = requests.post(
            f"{BASE_URL}/api/roles",
            json=create_payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert unauth_resp.status_code == 401 or unauth_resp.status_code == 403, "Unauthorized role creation allowed"

        # Check data integrity on role deletion: delete role
        del_resp = requests.delete(
            f"{BASE_URL}/api/roles/{role_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert del_resp.status_code in (200, 204), f"Role deletion failed: {del_resp.text}"

        # Verify role is deleted
        get_after_del_resp = requests.get(
            f"{BASE_URL}/api/roles/{role_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_after_del_resp.status_code == 404, "Deleted role still retrievable"

        role_id = None  # Mark role as deleted so that finally does not attempt deletion again

    finally:
        # Cleanup role if still exists
        if role_id is not None:
            try:
                requests.delete(
                    f"{BASE_URL}/api/roles/{role_id}",
                    auth=AUTH,
                    headers=HEADERS,
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_roles_api_role_management()
