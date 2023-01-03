export const renderGraph = (points, ctx, scale, center, color, width) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y } = point;

    ctx.lineTo(center.x + x * scale, center.y - y * scale);
  }

  ctx.stroke();
};
