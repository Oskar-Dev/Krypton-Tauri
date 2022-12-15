use tauri::State;
use std::{collections::HashMap, sync::Mutex};

pub struct ExpressionsList(pub Mutex<HashMap<u32, Expression>>);

#[derive(Debug, Clone)]
pub struct Expression {
    pub expr: String,
}

impl Expression {
    pub fn new(expr: String) -> Self {
        Self {
            expr,
        }
    }
}

#[tauri::command]
pub fn handle_input_change(id: u32, latex: String, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();

    expr_list.insert(id, Expression::new(latex));
}

#[tauri::command]
pub fn get_expressions_num(expressions_list: State<ExpressionsList>) -> usize {
    expressions_list.0.lock().unwrap().len()
}