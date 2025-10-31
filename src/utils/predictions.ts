export type CSVPrediction = {
  prediction: 'yes' | 'no' | 'ambiguous';
  probability: number | null; // 0..1
  bbox: { x: number; y: number; width: number; height: number } | null;
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
      const imgName = imageCell.split('/').pop() || '';
      if (!imgName) continue;
      const predRaw = obj.prediction ?? '';
      const probRaw = obj.probability ?? '';
      const xmin = obj.bbox_xmin ?? '';
      const ymin = obj.bbox_ymin ?? '';
      const xmax = obj.bbox_xmax ?? '';
      const ymax = obj.bbox_ymax ?? '';

      const prediction = predRaw === '1' ? 'pozitív' : predRaw === '0' ? 'negatív' : 'ambiguous';
      const probability = probRaw ? parseFloat(probRaw) : null;

      let bbox: CSVPrediction['bbox'] = null;
      const x1 = xmin !== '' ? Number(xmin) : NaN;
      const y1 = ymin !== '' ? Number(ymin) : NaN;
      const x2 = xmax !== '' ? Number(xmax) : NaN;
      const y2 = ymax !== '' ? Number(ymax) : NaN;
      if (!Number.isNaN(x1) && !Number.isNaN(y1) && !Number.isNaN(x2) && !Number.isNaN(y2)) {
        bbox = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
      }

      map[imgName] = {
        prediction: prediction as any,
        probability: isNaN(Number(probability)) ? null : probability,
        bbox,
      };
    }
    return map;
  } catch (err) {
    return {};
  }
}
