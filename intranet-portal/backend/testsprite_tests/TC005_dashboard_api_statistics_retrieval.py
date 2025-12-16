import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
USERNAME = "00001"
PASSWORD = "Admin123!"
TIMEOUT = 30

def test_dashboard_api_statistics_retrieval():
    url = f"{BASE_URL}/api/dashboard/statistics"
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, auth=HTTPBasicAuth(USERNAME, PASSWORD), timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Basic structure checks (these keys should reflect system status and user activities)
    expected_keys = [
        "activeUsers",
        "systemLoad",
        "uptime",
        "recentActivityCount",
        "errorRate",
        "requestsPerMinute"
    ]
    for key in expected_keys:
        assert key in data, f"Response JSON missing expected key: {key}"

    # Validate types (as example, adjust as per actual API schema if known)
    assert isinstance(data["activeUsers"], int) and data["activeUsers"] >= 0, "'activeUsers' must be a non-negative integer"
    assert isinstance(data["systemLoad"], (int, float)) and 0 <= data["systemLoad"] <= 100, "'systemLoad' must be a number between 0 and 100"
    assert isinstance(data["uptime"], (int, float)) and data["uptime"] >= 0, "'uptime' must be non-negative"
    assert isinstance(data["recentActivityCount"], int) and data["recentActivityCount"] >= 0, "'recentActivityCount' must be a non-negative integer"
    assert isinstance(data["errorRate"], (int, float)) and 0 <= data["errorRate"] <= 100, "'errorRate' must be between 0 and 100"
    assert isinstance(data["requestsPerMinute"], int) and data["requestsPerMinute"] >= 0, "'requestsPerMinute' must be a non-negative integer"

test_dashboard_api_statistics_retrieval()
