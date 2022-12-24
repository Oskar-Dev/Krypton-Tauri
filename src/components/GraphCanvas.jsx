import { invoke } from '@tauri-apps/api/tauri';
import React, { useEffect, useRef } from 'react';
import drawCoordinatePlane from '../graph-functions/drawCoordinatePlane';
import { renderGraph } from '../graph-functions/renderGraph';

const GraphCanvas = ({ forceRerender }) => {
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

    var center = { x: baseCenter.x + dragOffset.current.x, y: baseCenter.y + dragOffset.current.y };

    drawCoordinatePlane(canvas.width, canvas.height, dragOffset.current, ctx);

    invoke('get_expressions_ids').then((ids) => {
      for (var id of ids) {
        invoke('evaluate_points', { from: from, to: to, delta: delta, id: id })
          .then((data) => {
            var points = data[0];
            var { color, width } = data[1];

            renderGraph(points, ctx, scale, center, color, width);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
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

  useEffect(() => {
    render();
  }, [forceRerender]);

  return <canvas ref={canvasRef} />;
};

export default GraphCanvas;
