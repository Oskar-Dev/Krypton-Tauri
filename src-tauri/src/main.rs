#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use evealute_points::evaluate_points;
use expression::{
    handle_input_change, 
    get_expressions_ids, 
    create_new_expression, 
    get_expressions, 
    clear_expressions, 
    delete_expression,
    ExpressionsList
};

mod evealute_points;
mod expression;
mod math;

fn main() {
    tauri::Builder::default()
        .manage(ExpressionsList(Default::default()))
        .invoke_handler(tauri::generate_handler![
            evaluate_points, 
            handle_input_change, 
            get_expressions_ids, 
            create_new_expression, 
            get_expressions, 
            clear_expressions,
            delete_expression
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
