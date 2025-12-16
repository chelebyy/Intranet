import requests

BASE_URL = "http://localhost:5197"
TIMEOUT = 30

def test_auth_api_login_functionality():
    login_url = f"{BASE_URL}/auth/login"
    payload = {
        "username": "00001",
        "password": "Admin123!"
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(
            login_url,
            json=payload,
            headers=headers,
            timeout=TIMEOUT
        )
    except requests.RequestException as e:
        assert False, f"Request to login endpoint failed: {e}"

    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    token_keys = ["accessToken", "refreshToken", "token", "jwt"]
    has_token = any(key in json_response for key in token_keys)
    assert has_token, f"Response JSON does not contain expected token keys: {token_keys}"

    if "refreshToken" in json_response:
        assert isinstance(json_response["refreshToken"], str) and json_response["refreshToken"].strip() != "", "Empty refreshToken"

    if "accessToken" in json_response:
        assert isinstance(json_response["accessToken"], str) and json_response["accessToken"].strip() != "", "Empty accessToken"

    if "token" in json_response:
        assert isinstance(json_response["token"], str) and json_response["token"].strip() != "", "Empty token"

test_auth_api_login_functionality()