import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH = HTTPBasicAuth("00001", "Admin123!")
HEADERS = {
    "Content-Type": "application/json"
}
TIMEOUT = 30

def test_users_api_user_management():
    # Data for creating a user
    user_payload = {
        "username": "testuser_tc002",
        "password": "TestPassword!23",
        "email": "testuser_tc002@example.com",
        "firstName": "Test",
        "lastName": "User",
        "roles": ["User"],  # Assuming roles is an array of role names
        "departments": ["IT"]  # Changed to plural 'departments' field as a list
    }

    user_id = None
    try:
        # 1. Create User (POST /users)
        response_create = requests.post(
            f"{BASE_URL}/users",
            auth=AUTH,
            headers=HEADERS,
            json=user_payload,
            timeout=TIMEOUT
        )
        assert response_create.status_code == 201, f"User creation failed: {response_create.text}"
        user_data = response_create.json()
        user_id = user_data.get("id")
        assert user_id is not None, "User ID not returned on creation"

        # 2. Retrieve User (GET /users/{id})
        response_get = requests.get(
            f"{BASE_URL}/users/{user_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert response_get.status_code == 200, f"User retrieval failed: {response_get.text}"
        user_info = response_get.json()
        assert user_info.get("username") == user_payload["username"], "Username mismatch"
        assert user_info.get("email") == user_payload["email"], "Email mismatch"

        # 3. Update User (PUT /users/{id})
        update_payload = {
            "email": "updated_tc002@example.com",
            "firstName": "UpdatedTest",
            "lastName": "UpdatedUser",
            "roles": ["Admin"],  # Change role to Admin for RBAC verification
            "departments": ["HR"]  # Change departments field
        }
        response_update = requests.put(
            f"{BASE_URL}/users/{user_id}",
            auth=AUTH,
            headers=HEADERS,
            json=update_payload,
            timeout=TIMEOUT
        )
        assert response_update.status_code == 200, f"User update failed: {response_update.text}"
        updated_user = response_update.json()
        assert updated_user.get("email") == update_payload["email"], "Email not updated"
        assert updated_user.get("firstName") == update_payload["firstName"], "First name not updated"
        assert updated_user.get("lastName") == update_payload["lastName"], "Last name not updated"
        assert "Admin" in updated_user.get("roles", []), "Role not updated to Admin"

        # 4. Verify Role-Based Access Control (RBAC)
        invalid_update_payload = {
            "roles": ["InvalidRole123"]
        }
        response_invalid_update = requests.put(
            f"{BASE_URL}/users/{user_id}",
            auth=AUTH,
            headers=HEADERS,
            json=invalid_update_payload,
            timeout=TIMEOUT
        )
        assert response_invalid_update.status_code in (400, 403), "Invalid role accepted, RBAC failed"

        # 5. Delete User (DELETE /users/{id})
        response_delete = requests.delete(
            f"{BASE_URL}/users/{user_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert response_delete.status_code == 204, f"User deletion failed: {response_delete.text}"

        # 6. Confirm deletion by attempting to retrieve the deleted user
        response_get_deleted = requests.get(
            f"{BASE_URL}/users/{user_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert response_get_deleted.status_code == 404, "Deleted user still retrievable"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_users_api_user_management()
