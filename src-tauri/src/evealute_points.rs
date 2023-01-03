use meval::{Expr, Context};
use tauri::State;
use time::Instant;
use serde::Serialize;
use crate::{ExpressionsList, expression::Expression};
use crate::math;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Point {
    pub x: f64,
    pub y: f64
}

impl Point {
    fn new(x: f64, y: f64) -> Self {
        Self {
            x,
            y
        }
    }
}

#[tauri::command]
pub fn evaluate_points(from: i32, to: i32, delta: f64, id: u32, expressions_list: State<ExpressionsList>) -> Result<(Vec<Point>, Expression), String> {
    let start = Instant::now();
    
    let expr_list = expressions_list.0.lock().unwrap();

    let mut ctx = Context::new();
    ctx.func("cot", |x| 1.0 / x.tan());

    match expr_list.get(&id) {
        Some(expr_struct) => {
            let expr: Expr = match &expr_struct.expr {
                Some(expr) => expr.clone(),
                None => return Err(format!("No expression found, id: {}", id)),
            };

            let func = match expr.bind_with_context(ctx, "x") {
                Ok(v) => v,
                Err(_) => return Err(format!("Couldn't bind the expression, id: {}", id)),
            };
        
            let mut points: Vec<Point> = Vec::new();
        
            for i in from..to {
                let x: f64 = i as f64 * delta;
                let y: f64 = func(x);

                if y.is_infinite() || y.is_nan() {
                    continue;
                }
         
                points.push(Point::new(x, y));
            }

            let elapsed = start.elapsed();
            println!("Elapsed time: {:?}", elapsed);
        
            return Ok((points, expr_struct.clone()));
        },
        _ => return Err(format!("Couldn't find expression with id: {}", id)),
    };

    // let expr: Expr = match expr_to_parse.parse() {
    //     Ok(v) => v,
    //     Err(_) => return Err(format!("Couldn't parse the expression: {}", expr_to_parse)),
    // };

    
}