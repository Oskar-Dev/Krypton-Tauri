pub fn point_distance(x_1: f64, y_1: f64, x_2: f64, y_2: f64) -> f64 {
  ((x_1 - x_2).powi(2) +  (y_1 - y_2).powi(2)).sqrt()
}

pub fn derivative_at_point(x: f64, f: impl Fn(f64) -> f64) -> f64 {
  let h: f64 = 0.0000001;

  (f(x + h) - f(x)) / h
}