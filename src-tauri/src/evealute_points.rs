use meval::Expr;
use tauri::State;
use crate::ExpressionsList;

#[tauri::command]
pub fn evaluate_points(from: i32, to: i32, delta: f64, id: u32, expressions_list: State<ExpressionsList>) -> Result<Vec<[f64; 2]>, String> {
    let expr_list = expressions_list.0.lock().unwrap();
    // println!("{:?}", expr_list);
    // let expr_to_parse: &str = &expr_list.get(&0).unwrap().expr;
    let expr_to_parse: &str = match expr_list.get(&id) {
        Some(v) => &v.expr,
        _ => return Err(format!("Couldn't find expression with id: {}", id)),
    };

    let expr: Expr = match expr_to_parse.parse() {
        Ok(v) => v,
        Err(_) => return Err(format!("Couldn't parse the expression: {}", expr_to_parse)),
    };

    let func = match expr.bind("x") {
        Ok(v) => v,
        Err(_) => return Err(format!("Couldn't bind the expression: {}", expr_to_parse)),
    };

    let mut points: Vec<[f64; 2]> = Vec::new();

    for i in from..to {
        let x: f64 = i as f64 * delta;
        let y: f64 = func(x);

        points.push([x, y]);
    }

    Ok(points)
}