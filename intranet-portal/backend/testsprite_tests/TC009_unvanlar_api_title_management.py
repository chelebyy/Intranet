import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH = HTTPBasicAuth('00001', 'Admin123!')
HEADERS = {'Content-Type': 'application/json'}
TIMEOUT = 30

def test_unvanlar_api_title_management():
    unvan_data = {
        "unvan": "Test Title",
        "description": "Test description for Unvan"
    }
    updated_unvan_data = {
        "unvan": "Updated Test Title",
        "description": "Updated test description for Unvan"
    }

    # Create Unvan (POST)
    create_resp = requests.post(f"{BASE_URL}/api/unvanlar", json=unvan_data, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
    assert create_resp.status_code == 201, f"Unvan creation failed: {create_resp.text}"
    created_unvan = create_resp.json()
    assert "id" in created_unvan, "Created unvan response missing id"
    unvan_id = created_unvan["id"]

    try:
        # Retrieve Unvan (GET)
        get_resp = requests.get(f"{BASE_URL}/api/unvanlar/{unvan_id}", auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert get_resp.status_code == 200, f"Unvan retrieval failed: {get_resp.text}"
        unvan = get_resp.json()
        assert unvan.get("unvan") == unvan_data["unvan"]
        assert unvan.get("description") == unvan_data["description"]

        # Update Unvan (PUT)
        update_resp = requests.put(f"{BASE_URL}/api/unvanlar/{unvan_id}", json=updated_unvan_data, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert update_resp.status_code == 200, f"Unvan update failed: {update_resp.text}"
        updated_unvan = update_resp.json()
        assert updated_unvan.get("unvan") == updated_unvan_data["unvan"]
        assert updated_unvan.get("description") == updated_unvan_data["description"]

        # Validate validation: try invalid update (empty unvan)
        invalid_data = {"unvan": "", "description": "Invalid update"}
        invalid_resp = requests.put(f"{BASE_URL}/api/unvanlar/{unvan_id}", json=invalid_data, auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert invalid_resp.status_code == 400, "Invalid update did not return 400 Bad Request"

        # Access control test: try accessing unvan without auth
        no_auth_resp = requests.get(f"{BASE_URL}/api/unvanlar/{unvan_id}", headers=HEADERS, timeout=TIMEOUT)
        assert no_auth_resp.status_code == 401 or no_auth_resp.status_code == 403, "Access control failure: unauthorized access allowed"

    finally:
        # Delete Unvan (DELETE)
        delete_resp = requests.delete(f"{BASE_URL}/api/unvanlar/{unvan_id}", auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
        assert delete_resp.status_code in (200, 204), f"Unvan deletion failed: {delete_resp.text}"

test_unvanlar_api_title_management()
