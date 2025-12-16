import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
AUTH = HTTPBasicAuth('00001', 'Admin123!')
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_birimler_api_department_management():
    # Define payloads for creation and update
    create_payload = {
        "ad": "Test Departmanı",
        "aciklama": "Test department created for API test."
    }
    update_payload = {
        "ad": "Updated Test Departmanı",
        "aciklama": "Updated department description."
    }

    department_id = None

    try:
        # 1. Create a new department (birim)
        create_response = requests.post(
            f"{BASE_URL}/api/birimler",
            auth=AUTH,
            headers=HEADERS,
            json=create_payload,
            timeout=TIMEOUT
        )
        assert create_response.status_code == 201, f"Create failed: {create_response.text}"
        created_data = create_response.json()
        assert "id" in created_data, "Response missing 'id' field after creation"
        department_id = created_data["id"]
        assert created_data["ad"] == create_payload["ad"]
        assert created_data.get("aciklama") == create_payload["aciklama"]

        # 2. Retrieve the created department by ID
        get_response = requests.get(
            f"{BASE_URL}/api/birimler/{department_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_response.status_code == 200, f"Get by ID failed: {get_response.text}"
        get_data = get_response.json()
        assert get_data["id"] == department_id
        assert get_data["ad"] == create_payload["ad"]
        assert get_data.get("aciklama") == create_payload["aciklama"]

        # 3. Update the department
        update_response = requests.put(
            f"{BASE_URL}/api/birimler/{department_id}",
            auth=AUTH,
            headers=HEADERS,
            json=update_payload,
            timeout=TIMEOUT
        )
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        updated_data = update_response.json()
        assert updated_data["id"] == department_id
        assert updated_data["ad"] == update_payload["ad"]
        assert updated_data.get("aciklama") == update_payload["aciklama"]

        # 4. Retrieve the updated department again to confirm update
        get_updated_response = requests.get(
            f"{BASE_URL}/api/birimler/{department_id}",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert get_updated_response.status_code == 200, f"Get updated failed: {get_updated_response.text}"
        get_updated_data = get_updated_response.json()
        assert get_updated_data["id"] == department_id
        assert get_updated_data["ad"] == update_payload["ad"]
        assert get_updated_data.get("aciklama") == update_payload["aciklama"]

        # 5. List all departments to check new department is present and updated
        list_response = requests.get(
            f"{BASE_URL}/api/birimler",
            auth=AUTH,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        assert list_response.status_code == 200, f"List all failed: {list_response.text}"
        list_data = list_response.json()
        assert any(d["id"] == department_id and d["ad"] == update_payload["ad"] for d in list_data), "Updated department not found in list"

    finally:
        # 6. Delete the created department to clean up
        if department_id:
            delete_response = requests.delete(
                f"{BASE_URL}/api/birimler/{department_id}",
                auth=AUTH,
                headers=HEADERS,
                timeout=TIMEOUT
            )
            assert delete_response.status_code in (200, 204), f"Delete failed: {delete_response.text}"

        # 7. Confirm deletion by trying to get deleted department (should fail)
        if department_id:
            get_deleted_response = requests.get(
                f"{BASE_URL}/api/birimler/{department_id}",
                auth=AUTH,
                headers=HEADERS,
                timeout=TIMEOUT
            )
            assert get_deleted_response.status_code == 404, "Deleted department still accessible"

test_birimler_api_department_management()