import * as React from 'react';

// Simple bounding-box drawing tool. Emits bbox coordinates relative to image natural size.
// Usage: <BBoxTool src="/images/..." onChange={(bbox)=>{}} />

type BBox = { x: number; y: number; width: number; height: number } | null;

export default function BBoxTool({
  src,
  onChange,
  overlayBox,
}: {
  src: string;
  onChange: (b: BBox) => void;
  overlayBox?: BBox;
}) {
  const imgRef: any = { current: null };
  const [isDrawing, setIsDrawing] = (React as any).useState(false);
  const [start, setStart] = (React as any).useState(null);
  const [bbox, setBbox] = (React as any).useState(null);

  const toNaturalCoords = (clientX: number, clientY: number) => {
    const img = (imgRef.current as HTMLImageElement) || null;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const x = Math.max(0, clientX - rect.left);
    const y = Math.max(0, clientY - rect.top);
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    return { x: x * scaleX, y: y * scaleY };
  };

  const onMouseDown = (e: any) => {
    const p = toNaturalCoords(e.clientX, e.clientY);
    if (!p) return;
    setStart(p);
    setIsDrawing(true);
  };

  const onMouseMove = (e: any) => {
    if (!isDrawing || !start) return;
    const p = toNaturalCoords(e.clientX, e.clientY);
    if (!p) return;
    const x = Math.min(start.x, p.x);
    const y = Math.min(start.y, p.y);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);
    const newBox = { x, y, width: w, height: h };
    setBbox(newBox);
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    setStart(null);
    onChange(bbox);
  };

  const clearBox = () => {
    setBbox(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      <div
        className="relative inline-block w-full border rounded-md overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <img
          ref={el => (imgRef.current = el)}
          src={src}
          alt="bbox-source"
          className="block w-full h-auto"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          draggable={false}
        />

        {/* Draw user's box scaled to element */}
        {bbox &&
          imgRef.current &&
          (() => {
            const rect = (imgRef.current as HTMLImageElement).getBoundingClientRect();
            const scaleX = rect.width / (imgRef.current as HTMLImageElement).naturalWidth;
            const scaleY = rect.height / (imgRef.current as HTMLImageElement).naturalHeight;
            const style: any = {
              position: 'absolute',
              left: `${bbox.x * scaleX}px`,
              top: `${bbox.y * scaleY}px`,
              width: `${bbox.width * scaleX}px`,
              height: `${bbox.height * scaleY}px`,
              border: '2px dashed #0ea5e9',
              pointerEvents: 'none',
            };
            return <div style={style} />;
          })()}

        {/* Draw overlayBox if provided */}
        {overlayBox &&
          imgRef.current &&
          (() => {
            const rect = (imgRef.current as HTMLImageElement).getBoundingClientRect();
            const scaleX = rect.width / (imgRef.current as HTMLImageElement).naturalWidth;
            const scaleY = rect.height / (imgRef.current as HTMLImageElement).naturalHeight;
            const style: any = {
              position: 'absolute',
              left: `${overlayBox.x * scaleX}px`,
              top: `${overlayBox.y * scaleY}px`,
              width: `${overlayBox.width * scaleX}px`,
              height: `${overlayBox.height * scaleY}px`,
              border: '3px solid rgba(220,38,38,0.9)',
              boxShadow: '0 0 8px rgba(220,38,38,0.3)',
              pointerEvents: 'none',
            };
            return <div style={style} />;
          })()}
      </div>

      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={clearBox}>
          Clear box
        </button>
      </div>
    </div>
  );
}
