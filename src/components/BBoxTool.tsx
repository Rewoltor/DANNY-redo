import * as React from 'react';

type BBox = { x: number; y: number; width: number; height: number } | null;

export default function BBoxTool({
  src,
  onChange,
  overlayBox,
  imgRef: externalImgRef,
  enabled = true,
}: {
  src?: string;
  onChange: (b: BBox) => void;
  overlayBox?: BBox | null;
  imgRef?: any; // optional external image ref to overlay on
  enabled?: boolean;
}) {
  const imgRef = externalImgRef || (React as any).useRef(null);
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
    // set pixel backing size and style size to match image display size
    canvas.width = Math.round(rect.width);
    canvas.height = Math.round(rect.height);
    canvas.style.width = `${Math.round(rect.width)}px`;
    canvas.style.height = `${Math.round(rect.height)}px`;
    // ensure overlay container (if present) matches image size so absolute positioning works
    try {
      if (containerRef && containerRef.current) {
        containerRef.current.style.width = `${Math.round(rect.width)}px`;
        containerRef.current.style.height = `${Math.round(rect.height)}px`;
      }
    } catch (e) {}
    draw();
  };

  React.useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  React.useEffect(() => {
    // when overlayBox changes (e.g., AI box), render it
    // overlayBox represents the user's box when parent passes it; reflect into displayBox
    if (overlayBox) {
      const d = naturalToDisplay(overlayBox as BBox);
      setDisplayBox(d);
    } else {
      setDisplayBox(null);
    }
  }, [overlayBox]);

  const handlePointerDown = (e: any) => {
    if (!enabled) return;
    const p = clientToDisplay(e.clientX, e.clientY);
    if (!p) return;
    setStartPoint({ x: p.x, y: p.y });
    setDrawing(true);
  };

  const handlePointerMove = (e: any) => {
    if (!enabled) return;
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
      // NOTE: the clear/delete control is rendered as an HTML button overlay
      // (we no longer draw the delete circle/X inside the canvas to avoid duplicates)
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
    // some imageRefs may be real DOM nodes already loaded
    try {
      img.addEventListener && img.addEventListener('load', onLoad);
    } catch (e) {}
    resizeCanvas();
    return () => {
      try {
        img.removeEventListener && img.removeEventListener('load', onLoad);
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  React.useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayBox, overlayBox]);
  const usingExternal = !!externalImgRef;

  if (usingExternal) {
    // only render overlay canvas and clear button positioned absolutely
    return (
      <div
        ref={containerRef as any}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleCanvasClick}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: enabled ? 'auto' : 'none',
          }}
        />
        {/* clear button rendered on top of overlay when a box exists */}
        {displayBox && (
          <button
            onClick={clearBox}
            style={{
              position: 'absolute',
              left: displayBox.x + displayBox.width - 12,
              top: displayBox.y - 12,
              width: 24,
              height: 24,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            title="Clear box"
          >
            ×
          </button>
        )}
      </div>
    );
  }

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
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: enabled ? 'auto' : 'none',
          }}
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
