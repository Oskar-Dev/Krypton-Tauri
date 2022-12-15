import { invoke } from '@tauri-apps/api/tauri';
import React, { useEffect, useRef } from 'react';
import { renderGraph } from '../graph-functions/renderGraph';

const GraphCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  // const offset = window.innerWidth * 0.3;
  const canvasWidth = window.innerWidth * 0.75;
  const baseCenter = { x: canvasWidth / 2, y: window.innerHeight / 2 };

  var lastDrag = { x: null, y: null };

  var points = 1_000;
  var scale = 50;
  var delta = canvasWidth / (points * scale);

  var dragging = false;

  // const exprs = ['x', '3x', '2x', '1', '3'];
  // const expr = 'sin(x)/x*5';

  const rerenderGraph = (x, y) => {
    ctxRef.current.globalCompositeOperation = 'copy';
    ctxRef.current.drawImage(ctxRef.current.canvas, x, y);
    ctxRef.current.globalCompositeOperation = 'source-over';
  };

  const render = () => {
    var canvas = canvasRef.current;
    var ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var w = Math.ceil(canvasWidth / scale / delta);
    var c = Math.ceil((baseCenter.x - dragOffset.current.x) / scale / delta);

    var from = c - w;
    var to = c;

    // for (var expr of exprs) {
    // var points = evalutePoints(expr, from, to, delta);
    invoke('evaluate_points', { from: from, to: to, delta: delta }).then((points) => {
      var center = { x: baseCenter.x + dragOffset.current.x, y: baseCenter.y + dragOffset.current.y };
      renderGraph(points, ctx, scale, center);
      console.log(points.length);
    });

    // }
  };

  const setCanvas = () => {
    var canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    canvas.width = canvasWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
  };

  const handleDragStart = (e) => {
    dragging = true;

    lastDrag.x = e.clientX;
    lastDrag.y = e.clientY;
  };

  const handleDrag = (e) => {
    if (!dragging) return;

    var x = e.clientX;
    var y = e.clientY;

    var diff = { x: x - lastDrag.x, y: y - lastDrag.y };
    dragOffset.current.x += diff.x;
    dragOffset.current.y += diff.y;

    rerenderGraph(x - lastDrag.x, y - lastDrag.y);

    lastDrag.x = x;
    lastDrag.y = y;

    // render();
  };

  const handleDragEnd = () => {
    dragging = false;
    render();
  };

  useEffect(() => {
    setCanvas();

    var canvas = canvasRef.current;
    render();

    canvas.addEventListener('mousedown', (e) => handleDragStart(e));
    canvas.addEventListener('mousemove', (e) => handleDrag(e));
    canvas.addEventListener('mouseup', handleDragEnd);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default GraphCanvas;
