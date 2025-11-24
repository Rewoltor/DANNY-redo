export type CSVPrediction = {
  prediction: 0 | 1 | null;
  probability: number | null; // 0..1
  bbox: { x: number; y: number; width: number; height: number } | null;
  ground_truth_raw: string | null;
  ground_truth_binary: 0 | 1 | null;
  overlay: string | null;
  bbox_area_pct: number | null;
  phase: string;
  image_name: string;
};

export async function loadPredictionsCsv(): Promise<Record<string, CSVPrediction>> {
  try {
    const res = await fetch('/predictions/AI_predictions.csv');
    if (!res.ok) return {};
    const text = await res.text();
    const lines = text
      .trim()
      .split(/\r?\n/)
      .filter(l => l.trim() !== '');
    if (lines.length < 2) return {};
    const headers = lines[0].split(',').map(h => h.trim());
    const map: Record<string, CSVPrediction> = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => (obj[h] = cols[idx] ?? ''));
      const imageCell = obj.image || '';
      const phase = obj.phase || '';
      // Key by phase + image filename (e.g. "baseline_1.png")
      const key = `${phase}_${imageCell}`;

      if (!imageCell) continue;

      const predRaw = obj.prediction ?? '';
      const probRaw = obj.probability ?? '';
      const xmin = obj.bbox_xmin ?? '';
      const ymin = obj.bbox_ymin ?? '';
      const xmax = obj.bbox_xmax ?? '';
      const ymax = obj.bbox_ymax ?? '';

      const gtRaw = obj.ground_truth_raw ?? null;
      const gtBinaryRaw = obj.ground_truth_binary ?? '';
      const overlay = obj.overlay ?? null;
      const bboxAreaPctRaw = obj.bbox_area_pct ?? '';
      const imageName = obj.image_name ?? '';

      const prediction = predRaw === '1' ? 1 : predRaw === '0' ? 0 : null;
      const probability = probRaw ? parseFloat(probRaw) : null;
      const gtBinary = gtBinaryRaw === '1' ? 1 : gtBinaryRaw === '0' ? 0 : null;
      const bboxAreaPct = bboxAreaPctRaw ? parseFloat(bboxAreaPctRaw) : null;

      let bbox: CSVPrediction['bbox'] = null;
      const x1 = xmin !== '' ? Number(xmin) : NaN;
      const y1 = ymin !== '' ? Number(ymin) : NaN;
      const x2 = xmax !== '' ? Number(xmax) : NaN;
      const y2 = ymax !== '' ? Number(ymax) : NaN;
      if (!Number.isNaN(x1) && !Number.isNaN(y1) && !Number.isNaN(x2) && !Number.isNaN(y2)) {
        bbox = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
      }

      map[key] = {
        prediction: prediction as any,
        probability: isNaN(Number(probability)) ? null : probability,
        bbox,
        ground_truth_raw: gtRaw,
        ground_truth_binary: gtBinary,
        overlay,
        bbox_area_pct: isNaN(Number(bboxAreaPct)) ? null : bboxAreaPct,
        phase,
        image_name: imageName,
      };
    }
    return map;
  } catch (err) {
    return {};
  }
}
