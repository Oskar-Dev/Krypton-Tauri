use serde::Serialize;
use tauri::State;
use std::{collections::HashMap, sync::Mutex};

pub struct ExpressionsList(pub Mutex<HashMap<u32, Expression>>);

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Expression {
    pub expr: String,
    pub latex: String,
    pub id: u32,
}

impl Expression {
    pub fn new(expr: String, latex: String, id: u32) -> Self {
        Self {
            expr,
            latex,
            id
        }
    }
}

#[tauri::command]
pub fn create_new_expression(id: u32, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();

    expr_list.insert(id, Expression::new(String::new(), String::new(), id));
}

#[tauri::command]
pub fn delete_expression(id: u32, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();
    expr_list.remove(&id);
}

#[tauri::command]
pub fn get_expressions(expressions_list: State<ExpressionsList>) -> Vec<Expression> {
    let expr_list = expressions_list.0.lock().unwrap();
    let mut exprs = Vec::new();

    for (_, value) in expr_list.iter() {
        exprs.push(value.clone());
    }

    exprs
}

#[tauri::command]
pub fn clear_expressions(expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();
    expr_list.clear();
}

#[tauri::command]
pub fn handle_input_change(id: u32, latex: String, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();

    expr_list.insert(id, Expression::new(latex, String::new(), id));
}

#[tauri::command]
pub fn get_expressions_ids(expressions_list: State<ExpressionsList>) -> Vec<u32> {
    let expr_list = expressions_list.0.lock().unwrap();
    let mut ids: Vec<u32> = Vec::new();

    for (_, value) in expr_list.iter() {
        ids.push(value.id);
    } 

    ids
}