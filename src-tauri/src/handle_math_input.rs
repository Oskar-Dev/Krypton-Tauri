use meval::Expr;
use serde::Serialize;
use tauri::State;
use std::{collections::HashMap, sync::Mutex};

const DEFAULT_LINE_WIDTH: f32 = 3.0;

pub struct ExpressionsList(pub Mutex<HashMap<u32, Expression>>);

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Expression {
    pub id: u32,
    pub latex: String,
    pub parsed_latex: String,
    pub color: String,
    pub width: f32,

    #[serde(skip_serializing)]
    pub expr: Option<Expr>,
}

impl Expression {
    pub fn new(id: u32, color: String) -> Self {
        Self {
            id,
            color,
            ..Default::default()
        }
    }
}

impl Default for Expression {
    fn default() -> Self {
        Self {
            id: 0,
            latex: String::new(),
            parsed_latex: String::new(),
            color: String::from("#fff"),
            width: DEFAULT_LINE_WIDTH,

            expr: None
        }
    }
}

#[tauri::command]
pub fn create_new_expression(id: u32, color: String, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();

    expr_list.insert(id, Expression::new(id, color));
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
pub fn handle_input_change(id: u32, new_parsed_input: String, expressions_list: State<ExpressionsList>) {
    let mut expr_list = expressions_list.0.lock().unwrap();

    match expr_list.get_mut(&id) {
        Some(expr_struct) => { 
            // let expr_to_parse: &str = &expr_struct.expr;
            let expr: Result<Expr, _> = new_parsed_input.parse();

            match expr {
                Ok(v) => {
                    expr_struct.expr = Some(v);
                },
                Err(_) => {
                    expr_struct.expr = None;
                },
            }
        },
        _ => return,
    };
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