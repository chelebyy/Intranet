import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5197"
USERNAME = "00001"
PASSWORD = "Admin123!"
TIMEOUT = 30

def test_backup_api_database_backup_and_restore():
    auth = HTTPBasicAuth(USERNAME, PASSWORD)
    headers = {'Accept': 'application/json'}

    backup_id = None
    try:
        # 1. Activate maintenance mode
        maintenance_url = f"{BASE_URL}/api/backup/maintenance-mode"
        maintenance_payload = {"enabled": True}
        resp = requests.put(maintenance_url, json=maintenance_payload, headers=headers, auth=auth, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to enable maintenance mode: {resp.text}"

        # 2. Create database backup
        backup_create_url = f"{BASE_URL}/api/backup"
        resp = requests.post(backup_create_url, headers=headers, auth=auth, timeout=TIMEOUT)
        assert resp.status_code == 201, f"Backup creation failed: {resp.text}"
        resp_data = resp.json()
        backup_id = resp_data.get('id')
        assert backup_id is not None, "Backup ID not returned after creation."

        # 3. Retrieve backup info/details
        backup_get_url = f"{BASE_URL}/api/backup/{backup_id}"
        resp = requests.get(backup_get_url, headers=headers, auth=auth, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to retrieve backup info: {resp.text}"
        resp_data = resp.json()
        assert resp_data.get('id') == backup_id, "Retrieved backup ID does not match created backup ID."

        # 4. Restore database from backup
        restore_url = f"{BASE_URL}/api/backup/restore"
        restore_payload = {"backupId": backup_id}
        resp = requests.post(restore_url, json=restore_payload, headers=headers, auth=auth, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Database restoration failed: {resp.text}"
        restore_resp = resp.json()
        assert restore_resp.get('success') is True, "Database restore response did not indicate success."

        # 5. Deactivate maintenance mode
        maintenance_payload = {"enabled": False}
        resp = requests.put(maintenance_url, json=maintenance_payload, headers=headers, auth=auth, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Failed to disable maintenance mode: {resp.text}"

    finally:
        # Cleanup: delete the created backup if possible
        if backup_id is not None:
            backup_delete_url = f"{BASE_URL}/api/backup/{backup_id}"
            try:
                resp = requests.delete(backup_delete_url, headers=headers, auth=auth, timeout=TIMEOUT)
                assert resp.status_code in (200, 204), f"Failed to delete backup in cleanup: {resp.text}"
            except Exception:
                pass

test_backup_api_database_backup_and_restore()
