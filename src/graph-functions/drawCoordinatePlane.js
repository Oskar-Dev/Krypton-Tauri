const drawCoordinatePlane = (width, height, dragOffset, ctx) => {
  let buffer = 100;
  let gridWidth = 100;
  let gridHeight = 100;
  let left = (dragOffset.x % gridWidth) + width / 2 - Math.floor(width / 2 / gridWidth) * gridWidth - buffer;
  let top = (dragOffset.y % gridHeight) + height / 2 - Math.floor(height / 2 / gridHeight) * gridHeight - buffer;

  let gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-400');

  /// MAIN GRID
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = gridColor;

  // vertical grid lines
  for (let x = left; x < width; x += gridWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // horizontal grid lines
  for (let y = top; y < height; y += gridHeight) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  /// SMALL GRID
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = gridColor + '66';

  // vertical grid lines
  for (let x = left; x < width; x += gridWidth / 4) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // horizontal grid lines
  for (let y = top; y < height; y += gridHeight / 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  // AXIS
  ctx.beginPath();
  ctx.strokeStyle = '#fff';

  /// X AXIS
  ctx.moveTo(0, height / 2 + dragOffset.y);
  ctx.lineTo(width, height / 2 + dragOffset.y);

  /// Y AXIS
  ctx.moveTo(width / 2 + dragOffset.x, 0);
  ctx.lineTo(width / 2 + dragOffset.x, height);

  ctx.stroke();
};

export default drawCoordinatePlane;
