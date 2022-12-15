#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use evealute_points::evaluate_points;
use handle_math_input::{handle_input_change, get_expressions_num, ExpressionsList};

mod evealute_points;
mod handle_math_input;

fn main() {
    tauri::Builder::default()
        .manage(ExpressionsList(Default::default()))
        .invoke_handler(tauri::generate_handler![evaluate_points, handle_input_change, get_expressions_num])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
