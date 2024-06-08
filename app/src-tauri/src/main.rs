#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::command;
use std::fs;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};
use chrono::prelude::*;

#[derive(Serialize, Deserialize)]
struct Note {
    id: u64,
    title: String,
    content: String,
    folder_id: Option<u64>,
}

#[derive(Serialize, Deserialize)]
struct Folder {
    id: u64,
    name: String,
}

#[command]
fn save_chamber(notes: Vec<Note>, folders: Vec<Folder>, path: String) -> Result<(), String> {
    let data = serde_json::to_string(&(notes, folders)).map_err(|e| e.to_string())?;
    fs::write(path, data).map_err(|e| e.to_string())
}

#[command]
fn load_chamber(path: String) -> Result<(Vec<Note>, Vec<Folder>), String> {
    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let (notes, folders): (Vec<Note>, Vec<Folder>) = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok((notes, folders))
}

#[command]
fn save_versioned_file(path: String, content: String) -> Result<(), String> {
    let now: DateTime<Utc> = Utc::now();
    let versioned_path = format!("{}_{}.version", path, now.format("%Y%m%d%H%M%S"));
    fs::write(versioned_path, content.clone()).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())
}

#[command]
fn list_versions(path: String) -> Result<Vec<String>, String> {
    let binding = PathBuf::from(&path);
    let dir = binding.parent().unwrap();
    let file_stem = binding.file_stem().unwrap().to_str().unwrap();
    let mut versions = Vec::new();

    for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_name = entry.file_name();
        let file_name = file_name.to_str().unwrap();
        if file_name.starts_with(file_stem) && file_name.ends_with(".version") {
            versions.push(file_name.to_string());
        }
    }

    Ok(versions)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_chamber, load_chamber, save_versioned_file, list_versions])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
