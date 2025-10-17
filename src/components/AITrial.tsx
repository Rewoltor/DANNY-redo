import * as React from 'react';
import BBoxTool from './BBoxTool';
import CertaintyModal from './CertaintyModal';
import AIFeedbackModal from './AIFeedbackModal';
import { calculateIoU } from '../utils/calculateIoU';

export default function AITrial({
  imageSrc,
  onComplete,
  aiPrediction,
  aiBox,
  aiConfidence,
}: {
  imageSrc: string;
  onComplete: (data: any) => void;
  aiPrediction: 'yes' | 'no' | 'ambiguous' | string;
  aiBox: { x: number; y: number; width: number; height: number } | null;
  aiConfidence: number; // 0-1
}) {
  const [diagnosis, setDiagnosis] = (React as any).useState(null);
  const [dropdown, setDropdown] = (React as any).useState(null);
  const [userBox, setUserBox] = (React as any).useState(null);
  const [showDraw, setShowDraw] = (React as any).useState(false);
  const [showAIFeedback, setShowAIFeedback] = (React as any).useState(false);
  const [showInitialCertainty, setShowInitialCertainty] = (React as any).useState(false);
  const [showPostCertainty, setShowPostCertainty] = (React as any).useState(false);
  const startTime = (React as any).useRef(null);
  const [revisedDecision, setRevisedDecision] = (React as any).useState(null);
  const [initialConfidence, setInitialConfidence] = (React as any).useState(null);
  const [postAiConfidence, setPostAiConfidence] = (React as any).useState(null);

  React.useEffect(() => {
    startTime.current = Date.now();
    // clear local transient state when image changes
    setDiagnosis(null);
    setDropdown(null);
    setUserBox(null);
    setShowDraw(false);
    setShowAIFeedback(false);
    setShowInitialCertainty(false);
    setShowPostCertainty(false);
    setRevisedDecision(null);
    setInitialConfidence(null);
    setPostAiConfidence(null);
  }, [imageSrc]);

  const canDraw = dropdown === 'tünet' || dropdown === 'bizonytalan';
  // allow proceeding to diagnosis only when dropdown chosen and if tünet requires box it exists
  const canDiagnose =
    !!dropdown &&
    (dropdown === 'nincsen tünet' ||
      dropdown === 'bizonytalan' ||
      (dropdown === 'tünet' && !!userBox));
  const canNext = canDiagnose && !!diagnosis;

  const handleOpenDraw = () => setShowDraw(true);

  // When Next is clicked, first show initial certainty modal; after that show AI feedback modal
  const handleNext = () => {
    // show initial confidence modal before AI
    setShowInitialCertainty(true);
  };

  const handleApplyRevision = (newDecision: string) => {
    setRevisedDecision(newDecision);
  };

  const handleContinueAfterAI = () => {
    setShowAIFeedback(false);
    // show post-AI certainty
    setShowPostCertainty(true);
  };

  // initial certainty selected
  const handleInitialCertaintySelect = (value: number) => {
    setInitialConfidence(value);
    setShowInitialCertainty(false);
    // then show AI feedback modal
    setShowAIFeedback(true);
  };

  // post-AI certainty selected -> finalize trial
  const handlePostCertaintySelect = (value: number) => {
    setPostAiConfidence(value);
    setShowPostCertainty(false);
    const end = Date.now();
    const time_sec = startTime.current ? (end - startTime.current) / 1000 : 0;
    const finalDecision = revisedDecision || diagnosis;
    const iou = userBox && aiBox ? calculateIoU(userBox, aiBox) : null;

    onComplete({
      initial_decision: diagnosis,
      dropdown_choice: dropdown,
      user_box: userBox,
      ai_box: aiBox,
      ai_prediction: aiPrediction,
      ai_confidence: aiConfidence,
      bbox_iou: iou,
      decision_revised_after_ai: revisedDecision ? true : false,
      final_decision: finalDecision,
      initial_confidence: initialConfidence,
      post_ai_confidence: value,
      time_sec,
    });
  };

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <img src={imageSrc} alt="stim" className="w-full h-72 object-contain rounded border" />
        </div>

        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={() => setDiagnosis('yes')}
            className={`px-4 py-2 rounded ${
              diagnosis === 'yes' ? 'bg-accent text-white' : 'bg-gray-100'
            }`}
          >
            igen
          </button>
          <button
            onClick={() => setDiagnosis('no')}
            className={`px-4 py-2 rounded ${
              diagnosis === 'no' ? 'bg-accent text-white' : 'bg-gray-100'
            }`}
          >
            nem
          </button>
          <button
            onClick={() => setDiagnosis('ambiguous')}
            className={`px-4 py-2 rounded ${
              diagnosis === 'ambiguous' ? 'bg-accent text-white' : 'bg-gray-100'
            }`}
          >
            bizonytalan
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <select
            value={dropdown || ''}
            onChange={e => setDropdown(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Válassz opciót</option>
            <option value="tünet">tünet</option>
            <option value="bizonytalan">bizonytalan</option>
            <option value="nincsen tünet">nincsen tünet</option>
          </select>
          <button
            onClick={handleOpenDraw}
            disabled={!canDraw}
            className="ml-2 px-3 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Rajzolás
          </button>
        </div>

        {showDraw && (
          <div className="mb-4">
            <BBoxTool
              src={imageSrc}
              onChange={(b: any) => {
                setUserBox(b);
                // keep the drawn box visible but do not auto-close the drawing UI so user can delete/redo
                setShowDraw(false);
              }}
              overlayBox={aiBox}
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            disabled={!canNext}
            onClick={handleNext}
            className={`px-6 py-2 rounded ${
              canNext ? 'bg-accent text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Következő
          </button>
        </div>

        {showAIFeedback && (
          <AIFeedbackModal
            imageSrc={imageSrc}
            userBox={userBox}
            aiBox={aiBox}
            aiPrediction={aiPrediction}
            aiConfidence={aiConfidence}
            iouPercent={userBox && aiBox ? calculateIoU(userBox, aiBox) * 100 : 0}
            onRevise={handleApplyRevision}
            onContinue={handleContinueAfterAI}
          />
        )}

        {showInitialCertainty && (
          <CertaintyModal
            onSelect={handleInitialCertaintySelect}
            onClose={() => setShowInitialCertainty(false)}
          />
        )}

        {showPostCertainty && (
          <CertaintyModal
            onSelect={handlePostCertaintySelect}
            onClose={() => setShowPostCertainty(false)}
          />
        )}
      </div>
    </div>
  );
}
