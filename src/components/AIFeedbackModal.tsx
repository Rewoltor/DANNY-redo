import * as React from 'react';

export default function AIFeedbackModal({
  imageSrc,
  userBox,
  aiBox,
  aiPrediction,
  aiConfidence,
  iouPercent,
  // initialDecision is the user's decision before seeing the AI feedback
  // when available we should preselect that, otherwise fall back to aiPrediction
  initialDecision,
  onRevise,
  onContinue,
}: {
  imageSrc: string;
  userBox: { x: number; y: number; width: number; height: number } | null;
  aiBox: { x: number; y: number; width: number; height: number } | null;
  aiPrediction: 'yes' | 'no' | 'ambiguous' | string;
  aiConfidence: number; // 0-1
  iouPercent: number; // 0-100
  initialDecision?: string | null;
  onRevise: (newDecision: string) => void;
  onContinue: () => void;
}) {
  // Initialize to the user's original decision when available, otherwise fall back to aiPrediction
  const [decision, setDecision] = React.useState<string>(
    (initialDecision ?? aiPrediction) as string,
  );
  const imgRef = (React as any).useRef(null);
  const canvasRef = (React as any).useRef(null);

  React.useEffect(() => {
    // draw overlay when image and canvas ready
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw ai box in red
      const drawBox = (box: any, color: string, label: string) => {
        if (!box) return;
        // convert natural coords to display coords based on image naturalWidth/Height
        const sx = img.naturalWidth;
        const sy = img.naturalHeight;
        const scaleX = img.clientWidth / sx;
        const scaleY = img.clientHeight / sy;
        const x = box.x * scaleX;
        const y = box.y * scaleY;
        const w = box.width * scaleX;
        const h = box.height * scaleY;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.font = '12px sans-serif';
        ctx.fillText(label, x + 4, y + 12);
      };

      drawBox(aiBox, 'rgba(220,20,60,0.9)', 'AI');
      drawBox(userBox, 'rgba(30,144,255,0.9)', 'You');
    };

    // redraw when image loads or size changes
    if (img.complete) draw();
    const onLoad = () => draw();
    window.addEventListener('resize', draw);
    img.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('resize', draw);
      img.removeEventListener('load', onLoad);
    };
  }, [imageSrc, userBox, aiBox]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-4 inline-block">
        <h3 className="text-lg font-semibold mb-3">AI eredmény</h3>
        <div className="flex flex-col gap-4 items-center">
          <div className="relative border rounded">
            <img
              ref={imgRef}
              src={imageSrc}
              alt="stim"
              className="block max-w-full h-auto object-contain"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>

          <div className="w-full">
            <p className="mb-2">
              Átfedés: <strong>{Math.round(iouPercent)}%</strong>
            </p>
            <p className="mb-2">
              AI predikció: <strong>{aiPrediction}</strong>
            </p>
            <p className="mb-2">
              AI biztonság: <strong>{Math.round(aiConfidence * 100)}%</strong>
            </p>

            <div className="mb-4">
              <hr className="mt-5 mb-3" />
              <label className="block font-black">Mi a diagnózis?</label>
              <label className="block mb-2">Javítsd a döntésed (ha szükséges):</label>
              <select
                className="w-full p-2 border rounded"
                value={decision}
                onChange={e => setDecision(e.target.value)}
              >
                <option value="yes">Igen</option>
                <option value="no">Nem</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  onRevise(decision);
                  onContinue();
                }}
                className="px-3 py-2 rounded bg-accent text-white"
              >
                Mehet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
