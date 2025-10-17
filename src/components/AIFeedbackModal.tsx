import * as React from 'react';

export default function AIFeedbackModal({
  aiBox,
  aiPrediction,
  aiConfidence,
  iouPercent,
  onRevise,
  onContinue,
}: {
  aiBox: { x: number; y: number; width: number; height: number } | null;
  aiPrediction: 'yes' | 'no' | 'ambiguous' | string;
  aiConfidence: number; // 0-1
  iouPercent: number; // 0-100
  onRevise: (newDecision: string) => void;
  onContinue: () => void;
}) {
  const [decision, setDecision] = React.useState<string>(aiPrediction as string);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="text-lg font-semibold mb-3">AI eredmény</h3>
        <p className="mb-2">
          AI predikció: <strong>{aiPrediction}</strong>
        </p>
        <p className="mb-2">
          AI biztonság: <strong>{Math.round(aiConfidence * 100)}%</strong>
        </p>
        <p className="mb-4">
          DoBoV overlap: <strong>{Math.round(iouPercent)}%</strong>
        </p>

        <div className="mb-4">
          <label className="block mb-1">Javítsd a döntésed (ha szükséges):</label>
          <select
            className="w-full p-2 border rounded"
            value={decision}
            onChange={e => setDecision(e.target.value)}
          >
            <option value={aiPrediction as string}>{aiPrediction as string}</option>
            <option value="yes">yes</option>
            <option value="no">no</option>
            <option value="ambiguous">ambiguous</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={() => onRevise(decision)} className="px-3 py-2 rounded bg-gray-200">
            Apply
          </button>
          <button onClick={onContinue} className="px-3 py-2 rounded bg-accent text-white">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
