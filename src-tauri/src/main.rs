#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn evaluate_points(from: i32, to: i32, delta: f64) -> Vec<[f64; 2]> {
    let mut points: Vec<[f64; 2]> = vec![];

    vec![[1.0, 2.0], [5.0, 2.0], [1.0, 4.0]];

    for i in from..=to {
        let x: f64 = i as f64 * delta;
        let y: f64 = x.sin();

        points.push([x, y]);
    }

    points
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![evaluate_points])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
