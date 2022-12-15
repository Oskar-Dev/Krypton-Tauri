import { MATHJS } from '../utils/MATHJS';

export const evalutePoints = (expr, from, to, delta) => {
  var f = MATHJS.compile(expr);

  var newFrom = from / delta;
  var newTo = to / delta;

  const points = [];

  for (var i = newFrom; i <= newTo; i++) {
    var x = i * delta;
    var y = f.evaluate({ x: x });

    points.push({ x: x, y: y });
  }

  return points;
};
