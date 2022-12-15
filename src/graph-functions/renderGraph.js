export const renderGraph = (points, ctx, scale, center) => {
  ctx.beginPath();

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    // var { x, y } = point;
    var x = point[0];
    var y = point[1];

    ctx.lineTo(center.x + x * scale, center.y - y * scale);
  }

  ctx.stroke();
};
