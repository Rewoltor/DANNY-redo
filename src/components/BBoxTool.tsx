import * as React from 'react';

type BBox = { x: number; y: number; width: number; height: number } | null;

export default function BBoxTool({
  src,
  onChange,
  overlayBox,
}: {
  src: string;
  onChange: (b: BBox) => void;
  overlayBox?: BBox | null;
}) {
  const imgRef = (React as any).useRef(null);
  const canvasRef = (React as any).useRef(null);
  const containerRef = (React as any).useRef(null);
  const [drawing, setDrawing] = (React as any).useState(false);
  const [startPoint, setStartPoint] = (React as any).useState(null);
  const [displayBox, setDisplayBox] = (React as any).useState(null); // in displayed pixels

  // convert client coords to displayed image coords
  const clientToDisplay = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    return { x, y, rect };
  };

  // convert display box to natural image coords
  const displayToNatural = (box: BBox) => {
    const img = imgRef.current;
    if (!img || !box) return null;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    return {
      x: Math.round(box.x * scaleX),
      y: Math.round(box.y * scaleY),
      width: Math.round(box.width * scaleX),
      height: Math.round(box.height * scaleY),
    };
  };

  const naturalToDisplay = (box: BBox) => {
    const img = imgRef.current;
    if (!img || !box) return null;
    const rect = img.getBoundingClientRect();
    const scaleX = rect.width / img.naturalWidth;
    const scaleY = rect.height / img.naturalHeight;
    return {
      x: box.x * scaleX,
      y: box.y * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY,
    } as BBox;
  };

  // initialize canvas size to match image display size
  const resizeCanvas = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const rect = img.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw();
  };

  React.useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  React.useEffect(() => {
    // when overlayBox changes (e.g., AI box), render it
    if (!overlayBox) return;
    const d = naturalToDisplay(overlayBox as BBox);
    setDisplayBox(d);
  }, [overlayBox]);

  const handlePointerDown = (e: any) => {
    const p = clientToDisplay(e.clientX, e.clientY);
    if (!p) return;
    setStartPoint({ x: p.x, y: p.y });
    setDrawing(true);
  };

  const handlePointerMove = (e: any) => {
    if (!drawing || !startPoint) return;
    const p = clientToDisplay(e.clientX, e.clientY);
    if (!p) return;
    const x = Math.min(startPoint.x, p.x);
    const y = Math.min(startPoint.y, p.y);
    const w = Math.abs(p.x - startPoint.x);
    const h = Math.abs(p.y - startPoint.y);
    setDisplayBox({ x, y, width: w, height: h });
    draw();
  };

  const handlePointerUp = () => {
    if (!displayBox) {
      setDrawing(false);
      setStartPoint(null);
      return;
    }
    // convert to natural coords
    const nat = displayToNatural(displayBox);
    onChange(nat);
    setDrawing(false);
    setStartPoint(null);
  };

  const clearBox = () => {
    setDisplayBox(null);
    onChange(null);
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (displayBox) {
      ctx.strokeStyle = 'rgba(16,185,129,0.95)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(displayBox.x, displayBox.y, displayBox.width, displayBox.height);
      ctx.fillStyle = 'rgba(16,185,129,0.12)';
      ctx.fillRect(displayBox.x, displayBox.y, displayBox.width, displayBox.height);
      // draw delete circle top-right
      const cx = displayBox.x + displayBox.width - 10;
      const cy = displayBox.y + 10;
      ctx.setLineDash([]);
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×', cx, cy + 1);
    }
    // draw overlayBox (AI) in red beneath user box
    if (overlayBox) {
      ctx.strokeStyle = 'rgba(220,38,38,0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(overlayBox.x, overlayBox.y, overlayBox.width, overlayBox.height);
      ctx.fillStyle = 'rgba(220,38,38,0.08)';
      ctx.fillRect(overlayBox.x, overlayBox.y, overlayBox.width, overlayBox.height);
    }
  };

  // handle click on canvas to detect delete button
  const handleCanvasClick = (e: any) => {
    if (!displayBox) return;
    const p = clientToDisplay(e.clientX, e.clientY);
    if (!p) return;
    const cx = displayBox.x + displayBox.width - 10;
    const cy = displayBox.y + 10;
    const dx = p.x - cx;
    const dy = p.y - cy;
    if (dx * dx + dy * dy <= 10 * 10) {
      clearBox();
    }
  };

  React.useEffect(() => {
    // whenever image loads or size changes, update canvas
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      resizeCanvas();
    };
    img.addEventListener('load', onLoad);
    resizeCanvas();
    return () => img.removeEventListener('load', onLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  React.useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayBox, overlayBox]);

  return (
    <div className="w-full" ref={containerRef}>
      <div
        className="relative w-full border rounded-md overflow-hidden"
        style={{ height: '18rem' }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="annotation"
          className="w-full h-full object-contain block"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleCanvasClick}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'auto' }}
        />
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={clearBox}>
          Clear box
        </button>
      </div>
    </div>
  );
}
