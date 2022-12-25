const drawCoordinatePlane = (width, height, dragOffset, ctx) => {
  let buffer = 100;
  let gridWidth = 100;
  let gridHeight = 100;
  let left = (dragOffset.x % gridWidth) + width / 2 - Math.floor(width / 2 / gridWidth) * gridWidth - buffer;
  let top = (dragOffset.y % gridHeight) + height / 2 - Math.floor(height / 2 / gridHeight) * gridHeight - buffer;

  let gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-400');
  let textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text');

  let arrowSize = 8;
  let textPaddingY = 20;
  let textPaddingX = 8;

  let xAxisLabel = 'x';
  let yAxisLabel = 'y';

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
  ctx.strokeStyle = textColor;

  /// X AXIS
  ctx.moveTo(0, height / 2 + dragOffset.y);
  ctx.lineTo(width, height / 2 + dragOffset.y);

  // X AXIS arrow
  ctx.lineTo(width - arrowSize, height / 2 + dragOffset.y - arrowSize);
  ctx.moveTo(width, height / 2 + dragOffset.y);
  ctx.lineTo(width - arrowSize, height / 2 + dragOffset.y + arrowSize);

  /// Y AXIS
  ctx.moveTo(width / 2 + dragOffset.x, height);
  ctx.lineTo(width / 2 + dragOffset.x, 0);

  /// Y AXIS arrow
  ctx.lineTo(width / 2 + dragOffset.x + arrowSize, arrowSize);
  ctx.moveTo(width / 2 + dragOffset.x, 0);
  ctx.lineTo(width / 2 + dragOffset.x - arrowSize, arrowSize);

  ctx.stroke();

  // AXIS NUMBERS
  ctx.fillStyle = textColor;
  ctx.font = '1rem PoppinsRegular';
  ctx.textAlign = 'center';

  // X AXIS NUMBERS
  let xAxisNumbers = Math.ceil(width / gridWidth);

  for (let i = 0; i < xAxisNumbers; i++) {
    let xPos = i * gridWidth + (dragOffset.x % gridWidth) + 20;
    let value = -((width / 2 + dragOffset.x - xPos) / gridWidth);
    if (value === 0) continue;

    ctx.fillText(value, xPos, height / 2 + dragOffset.y + textPaddingY);
  }

  // 0
  ctx.textAlign = 'right';
  ctx.fillText(0, width / 2 + dragOffset.x - textPaddingX, height / 2 + dragOffset.y + textPaddingY);

  // Y AXIS NUMBERS
  let yAxisNumbers = Math.ceil(height / gridHeight);

  for (let i = 0; i < yAxisNumbers; i++) {
    let yPos = i * gridHeight + (dragOffset.y % gridHeight) + 10;
    let value = -Math.round((height / 2 + dragOffset.y - yPos) / gridHeight);
    if (value === 0) continue;

    ctx.fillText(value, width / 2 + dragOffset.x - textPaddingX, yPos);
  }

  // AXIS LABELS
  ctx.fillText(xAxisLabel, width - 12, height / 2 + dragOffset.y + 16);

  ctx.textAlign = 'left';
  ctx.fillText(yAxisLabel, width / 2 + dragOffset.x + 8, 24);
};

export default drawCoordinatePlane;
