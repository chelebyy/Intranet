import requests
import time

BASE_URL = "http://localhost:5197"
AUTH_USERNAME = "00001"
AUTH_PASSWORD = "Admin123!"
TIMEOUT = 30

def test_ip_restrictions_api_management():
    headers = {
        "Content-Type": "application/json"
    }

    login_url = f"{BASE_URL}/api/auth/login"
    ip_restrictions_url = f"{BASE_URL}/api/iprestrictions"

    # First, login to get bearer token
    login_payload = {
        "sicil": AUTH_USERNAME,
        "password": AUTH_PASSWORD
    }
    login_resp = requests.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}: {login_resp.text}"
    login_json = login_resp.json()
    token = login_json.get("accessToken")
    assert token, "No access token found in login response"

    auth_headers = headers.copy()
    auth_headers["Authorization"] = f"Bearer {token}"

    # Helper function to add IP restriction
    def add_ip_restriction(ip_or_block, description, restriction_type="allow"):
        payload = {
            "ip": ip_or_block,
            "description": description,
            "type": restriction_type  # assume 'allow' or 'block'
        }
        resp = requests.post(ip_restrictions_url, json=payload, headers=auth_headers, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json()  # Assume contains created resource including id

    # Helper function to update IP restriction
    def update_ip_restriction(restriction_id, updated_fields):
        url = f"{ip_restrictions_url}/{restriction_id}"
        resp = requests.put(url, json=updated_fields, headers=auth_headers, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json()

    # Helper function to delete IP restriction
    def delete_ip_restriction(restriction_id):
        url = f"{ip_restrictions_url}/{restriction_id}"
        resp = requests.delete(url, headers=auth_headers, timeout=TIMEOUT)
        if resp.status_code not in (200, 204):
            resp.raise_for_status()

    # Helper function to attempt login from an IP (simulate by sending IP in a header or payload)
    def attempt_login(sicil="00001", password="Admin123!", ip_address=None):
        """
        Assuming the login endpoint supports a header or json field "X-Forwarded-For" or "clientIp" 
        to simulate login IP for testing enforcement. We will try passing "X-Forwarded-For" header.
        """
        login_headers = headers.copy()
        login_headers["X-Forwarded-For"] = ip_address if ip_address else "127.0.0.1"
        payload = {
            "sicil": sicil,
            "password": password
        }
        resp = requests.post(login_url, json=payload, headers=login_headers, timeout=TIMEOUT)
        return resp

    created_restriction_ids = []

    try:
        # Add an allow IP restriction for 192.168.1.100
        resp_allow = add_ip_restriction("192.168.1.100", "Allow IP test", "allow")
        assert "id" in resp_allow, "Add IP restriction response must contain id"
        allow_id = resp_allow["id"]
        created_restriction_ids.append(allow_id)

        # Add a block IP restriction for 10.0.0.0/24
        resp_block = add_ip_restriction("10.0.0.0/24", "Block IP block test", "block")
        assert "id" in resp_block, "Add IP block restriction response must contain id"
        block_id = resp_block["id"]
        created_restriction_ids.append(block_id)

        # Update the allow IP restriction description
        updated_description = "Updated allow IP description"
        updated_allow = update_ip_restriction(allow_id, {"description": updated_description})
        assert updated_allow.get("description") == updated_description, "Description update failed"

        # Test login enforcement

        # Attempt login from allowed IP (192.168.1.100) - Expected: success (200), with tokens
        resp_login_allow = attempt_login(ip_address="192.168.1.100")
        assert resp_login_allow.status_code == 200, f"Login from allowed IP failed: {resp_login_allow.text}"
        json_login_allow = resp_login_allow.json()
        assert "token" in json_login_allow or "accessToken" in json_login_allow, "Login success response missing token"

        # Attempt login from blocked IP (10.0.0.5) inside blocked range - Expected: failure (403 or 401)
        resp_login_block = attempt_login(ip_address="10.0.0.5")
        assert resp_login_block.status_code in (401,403), f"Login from blocked IP should fail but got {resp_login_block.status_code}"

        # Attempt login from non-listed IP (e.g., 8.8.8.8)
        # Depending on system default policy, assume deny if not allowed explicitly
        resp_login_other = attempt_login(ip_address="8.8.8.8")
        # We expect this to be denied: 401 or 403
        assert resp_login_other.status_code in (401,403), f"Login from non-listed IP should fail but got {resp_login_other.status_code}"

    finally:
        # Cleanup created restrictions
        for restriction_id in created_restriction_ids:
            try:
                delete_ip_restriction(restriction_id)
            except Exception:
                pass  # ignore cleanup errors to not mask test errors

test_ip_restrictions_api_management()
