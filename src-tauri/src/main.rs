// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use keyring::{Entry, Error as KeyringError};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

const SERVICE_NAME: &str = "com.queryforce.app"; // your app/service id
const INDEX_USERNAME: &str = "__ids_index__"; // reserved key for our {id,label} index

/// IPC type returned to the UI (safe to serialize).
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CredentialsIpc {
    pub id: String,
    pub label: String,
    pub url: String,
    pub client_id: String,
    pub client_secret: String,
}

/// On-disk (keychain) payload. Mirrors IPC + keeps id.
#[derive(Debug, Serialize, Deserialize, Clone)]
struct StoredRecord {
    id: String,
    label: String,
    url: String,
    client_id: String,
    client_secret: String,
}

/// Index entry mapping id -> label (for listing & lookups).
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
struct IndexItem {
    id: String,
    label: String,
}

/* ---------- Index helpers ---------- */

fn read_index() -> Result<Vec<IndexItem>, String> {
    let entry = Entry::new(SERVICE_NAME, INDEX_USERNAME)
        .map_err(|e| format!("Keyring init (index) failed: {e}"))?;

    match entry.get_password() {
        Ok(json) => serde_json::from_str::<Vec<IndexItem>>(&json)
            .map_err(|e| format!("Index JSON parse failed: {e}")),
        Err(KeyringError::NoEntry) => Ok(Vec::new()),
        Err(e) => Err(format!("Keyring read (index) failed: {e}")),
    }
}

fn write_index(mut items: Vec<IndexItem>) -> Result<(), String> {
    // Sort & dedupe by id for stability
    items.sort_by(|a, b| a.id.cmp(&b.id));
    items.dedup_by(|a, b| a.id == b.id);

    let json =
        serde_json::to_string(&items).map_err(|e| format!("Index JSON serialize failed: {e}"))?;
    let entry = Entry::new(SERVICE_NAME, INDEX_USERNAME)
        .map_err(|e| format!("Keyring init (index) failed: {e}"))?;
    entry
        .set_password(&json)
        .map_err(|e| format!("Keyring write (index) failed: {e}"))
}

/* ---------- Core helpers ---------- */

fn read_record_by_id(id: &str) -> Result<StoredRecord, String> {
    let entry = Entry::new(SERVICE_NAME, id).map_err(|e| format!("Keyring init failed: {e}"))?;
    let json = entry
        .get_password()
        .map_err(|e| format!("Keyring read failed: {e}"))?;
    serde_json::from_str::<StoredRecord>(&json).map_err(|e| format!("JSON parse failed: {e}"))
}

fn write_record(rec: &StoredRecord) -> Result<(), String> {
    let entry =
        Entry::new(SERVICE_NAME, &rec.id).map_err(|e| format!("Keyring init failed: {e}"))?;
    let json = serde_json::to_string(rec).map_err(|e| format!("JSON serialize failed: {e}"))?;
    entry
        .set_password(&json)
        .map_err(|e| format!("Keyring write failed: {e}"))
}

/* ---------- Commands ---------- */

/// New: create a credential, returns record with generated id.
#[tauri::command]
fn create_credentials(
    label: String,
    url: String,
    client_id: String,
    client_secret: String,
) -> Result<CredentialsIpc, String> {
    let id = Uuid::new_v4().to_string();

    let rec = StoredRecord {
        id: id.clone(),
        label: label.clone(),
        url,
        client_id,
        client_secret,
    };

    // 1) store record under (service=SERVICE_NAME, username=id)
    write_record(&rec)?;

    // 2) update index
    let mut index = read_index()?;
    index.push(IndexItem {
        id: id.clone(),
        label: label.clone(),
    });
    write_index(index)?;

    Ok(CredentialsIpc {
        id,
        label,
        url: rec.url,
        client_id: rec.client_id,
        client_secret: rec.client_secret,
    })
}

/// Back-compat: keep your old signature; acts like "create" and discards the return.
#[tauri::command]
fn save_credentials(
    label: String,
    url: String,
    client_id: String,
    client_secret: String,
) -> Result<(), String> {
    let _ = create_credentials(label, url, client_id, client_secret)?;
    Ok(())
}

/// Load by *label* (first match) — back-compat helper.
#[tauri::command]
fn load_credentials(label: String) -> Result<CredentialsIpc, String> {
    let index = read_index()?;
    let Some(item) = index.into_iter().find(|i| i.label == label) else {
        return Err(format!("No credential found with label '{label}'"));
    };
    let rec = read_record_by_id(&item.id)?;
    Ok(CredentialsIpc {
        id: rec.id,
        label: rec.label,
        url: rec.url,
        client_id: rec.client_id,
        client_secret: rec.client_secret,
    })
}

/// New: load a single credential by id.
#[tauri::command]
fn load_credentials_by_id(id: String) -> Result<CredentialsIpc, String> {
    let rec = read_record_by_id(&id)?;
    Ok(CredentialsIpc {
        id: rec.id,
        label: rec.label,
        url: rec.url,
        client_id: rec.client_id,
        client_secret: rec.client_secret,
    })
}

/// Includes `id` for all items.
#[tauri::command]
fn load_all_credentials() -> Result<Vec<CredentialsIpc>, String> {
    let index = read_index()?;
    let mut out = Vec::with_capacity(index.len());

    for item in index {
        match read_record_by_id(&item.id) {
            Ok(rec) => out.push(CredentialsIpc {
                id: rec.id,
                label: rec.label,
                url: rec.url,
                client_id: rec.client_id,
                client_secret: rec.client_secret,
            }),
            // If a record is missing/corrupt, skip it but keep going
            Err(KeyringReadErr) => { /* optionally: log */ }
        }
    }

    Ok(out)
}

/// New: delete by id (removes record and index entry).
#[tauri::command]
fn delete_credentials(id: String) -> Result<(), String> {
    // remove record
    let entry = Entry::new(SERVICE_NAME, &id).map_err(|e| format!("Keyring init failed: {e}"))?;
    match entry.delete_credential() {
        Ok(_) | Err(KeyringError::NoEntry) => { /* proceed */ }
        Err(e) => return Err(format!("Keyring delete failed: {e}")),
    }

    // remove from index
    let mut index = read_index()?;
    index.retain(|i| i.id != id);
    write_index(index)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // new
            create_credentials,
            load_credentials_by_id,
            delete_credentials,
            // existing
            save_credentials,
            load_credentials,
            load_all_credentials
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
