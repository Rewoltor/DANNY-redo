import * as React from 'react';
import CertaintyModal from './CertaintyModal';

export default function NoAITrial({
  imageSrc,
  onComplete,
}: {
  imageSrc: string;
  onComplete: (data: any) => void;
}) {
  const [choice, setChoice] = (React as any).useState(null);
  const [showCertainty, setShowCertainty] = (React as any).useState(false);
  const start = (React as any).useRef(null);
  React.useEffect(() => {
    start.current = Date.now();
    // clear local answers when image changes
    setChoice(null);
    setShowCertainty(false);
  }, [imageSrc]);

  const handleNext = () => {
    setShowCertainty(true);
  };

  const handleSelectCertainty = (value: number) => {
    const end = Date.now();
    const startVal = start.current as number | null;
    const time_sec = startVal ? (end - startVal) / 1000 : 0;
    setShowCertainty(false);
    const payload = { response: choice, confidence: value, time_sec };
    onComplete(payload as any);
    // reset local state so if component stays mounted it clears answers
    setChoice(null);
    setShowCertainty(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <img src={imageSrc} alt="stim" className="w-full h-72 object-contain rounded border" />
        </div>

        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={() => setChoice('igen')}
            className={`px-4 py-2 rounded ${
              choice === 'igen' ? 'bg-text text-white' : 'bg-gray-100'
            }`}
          >
            igen
          </button>
          <button
            onClick={() => setChoice('nem')}
            className={`px-4 py-2 rounded ${
              choice === 'nem' ? 'bg-text text-white' : 'bg-gray-100'
            }`}
          >
            nem
          </button>
        </div>

        <div className="flex justify-center">
          <button
            disabled={!choice}
            onClick={handleNext}
            className={`px-6 py-2 rounded ${
              choice ? 'bg-accent text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {showCertainty && (
          <CertaintyModal
            onSelect={handleSelectCertainty}
            onClose={() => setShowCertainty(false)}
          />
        )}
      </div>
    </div>
  );
}
