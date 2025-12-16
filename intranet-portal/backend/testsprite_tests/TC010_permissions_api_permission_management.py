import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH = HTTPBasicAuth("00001", "Admin123!")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30


def test_permissions_api_permission_management():
    created_permission_id = None
    created_role_id = None
    assign_response = None

    try:
        # 1. Create a new permission
        permission_payload = {
            "name": "test_permission_tc010",
            "description": "Test permission for TC010",
            "module": "test_module"
        }
        resp_create = requests.post(
            f"{BASE_URL}/api/permissions",
            json=permission_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_create.status_code == 201, f"Permission creation failed: {resp_create.text}"
        created_permission = resp_create.json()
        assert "id" in created_permission, "Created permission has no ID"
        created_permission_id = created_permission["id"]

        # 2. Update the created permission
        updated_permission_payload = {
            "name": "test_permission_tc010_updated",
            "description": "Updated test permission for TC010",
            "module": "test_module_updated"
        }
        resp_update = requests.put(
            f"{BASE_URL}/api/permissions/{created_permission_id}",
            json=updated_permission_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_update.status_code == 200, f"Permission update failed: {resp_update.text}"
        updated_permission = resp_update.json()
        assert updated_permission["name"] == updated_permission_payload["name"]
        assert updated_permission["description"] == updated_permission_payload["description"]
        assert updated_permission["module"] == updated_permission_payload["module"]

        # 3. Create a new role to assign the permission
        role_payload = {
            "name": "test_role_tc010",
            "description": "Role to test assignment of permission TC010"
        }
        resp_role_create = requests.post(
            f"{BASE_URL}/api/roles",
            json=role_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_role_create.status_code == 201, f"Role creation failed: {resp_role_create.text}"
        created_role = resp_role_create.json()
        assert "id" in created_role, "Created role has no ID"
        created_role_id = created_role["id"]

        # 4. Assign permission to role
        assign_payload = {"permissionIds": [created_permission_id]}
        resp_assign = requests.post(
            f"{BASE_URL}/api/roles/{created_role_id}/permissions",
            json=assign_payload,
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_assign.status_code == 200 or resp_assign.status_code == 204, f"Assigning permission to role failed: {resp_assign.text}"
        assign_response = resp_assign

        # 5. Verify assignment by retrieving role permissions
        resp_get_permissions = requests.get(
            f"{BASE_URL}/api/roles/{created_role_id}/permissions",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_get_permissions.status_code == 200, f"Fetching role permissions failed: {resp_get_permissions.text}"
        permissions_list = resp_get_permissions.json()
        assert any(p["id"] == created_permission_id for p in permissions_list), "Assigned permission not found in role permissions"

        # 6. Delete the permission
        resp_delete_permission = requests.delete(
            f"{BASE_URL}/api/permissions/{created_permission_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_delete_permission.status_code in (200, 204), f"Deleting permission failed: {resp_delete_permission.text}"
        created_permission_id = None  # mark as deleted

        # 7. Delete the role
        resp_delete_role = requests.delete(
            f"{BASE_URL}/api/roles/{created_role_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT,
        )
        assert resp_delete_role.status_code in (200, 204), f"Deleting role failed: {resp_delete_role.text}"
        created_role_id = None

    finally:
        # Cleanup permission if still created and not deleted
        if created_permission_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/permissions/{created_permission_id}",
                    auth=AUTH,
                    headers=HEADERS,
                    timeout=TIMEOUT,
                )
            except Exception:
                pass
        # Cleanup role if still created and not deleted
        if created_role_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/roles/{created_role_id}",
                    auth=AUTH,
                    headers=HEADERS,
                    timeout=TIMEOUT,
                )
            except Exception:
                pass


test_permissions_api_permission_management()