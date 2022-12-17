use meval::Expr;
use tauri::State;
use crate::{ExpressionsList, handle_math_input::Expression};

#[tauri::command]
pub fn evaluate_points(from: i32, to: i32, delta: f64, id: u32, expressions_list: State<ExpressionsList>) -> Result<(Vec<[f64; 2]>, Expression), String> {
    let expr_list = expressions_list.0.lock().unwrap();

    match expr_list.get(&id) {
        Some(expr_struct) => {
            let expr: Expr = match &expr_struct.expr {
                Some(expr) => expr.clone(),
                None => return Err(format!("No expression found, id: {}", id)),
            };

            let func = match expr.bind("x") {
                Ok(v) => v,
                Err(_) => return Err(format!("Couldn't bind the expression, id: {}", id)),
            };
        
            let mut points: Vec<[f64; 2]> = Vec::new();
        
            for i in from..to {
                let x: f64 = i as f64 * delta;
                let y: f64 = func(x);
        
                points.push([x, y]);
            }
        
            return Ok((points, expr_struct.clone()));
        },
        _ => return Err(format!("Couldn't find expression with id: {}", id)),
    };

    // let expr: Expr = match expr_to_parse.parse() {
    //     Ok(v) => v,
    //     Err(_) => return Err(format!("Couldn't parse the expression: {}", expr_to_parse)),
    // };

    
}