import * as React from 'react';
import NoAITrial from './NoAITrial';
import AITrial from './AITrial';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';
import { useParams, useNavigate } from 'react-router-dom';

export default function TestScreenContainer({
  phase,
  mode, // 'ai' | 'noai' (optional if computing from treatment)
  poolFolder,
  trialsCount = 10,
  onFinish,
}: {
  phase?: string;
  mode?: 'ai' | 'noai';
  poolFolder?: string; // e.g., 'screening' or 'baseline'
  trialsCount?: number;
  onFinish?: () => void;
}) {
  const app = useAppContext();
  const params = useParams();
  const navigate = useNavigate();
  const [index, setIndex] = (React as any).useState(0);
  const [images, setImages] = (React as any).useState([]);

  // determine phase from prop or route param
  const effectivePhase = phase || (params.phase as string) || 'baseline';
  const effectivePool = poolFolder || effectivePhase;

  React.useEffect(() => {
    // load images 1..10 from public/annotation/<effectivePool>
    const imgs: string[] = [];
    for (let i = 1; i <= 10; i++) imgs.push(`/annotation/${effectivePool}/${i}.png`);
    setImages(imgs);
  }, [effectivePool]);

  // compute mode from treatmentGroup and phase if not provided
  const effectiveMode: 'ai' | 'noai' = mode
    ? mode
    : ((): 'ai' | 'noai' => {
        // example: for 'experiment' phase, treatmentGroup '1' => 'ai', '0' => 'noai'
        if (!app || !app.treatmentGroup) return 'noai';
        if (effectivePhase === 'baseline' || effectivePhase === 'screening') return 'noai';
        // treatmentGroup may be 'treatment'|'control' or '1'|'0'
        const tg = String(app.treatmentGroup || '');
        if (tg === 'treatment' || tg === '1' || tg.startsWith('1')) return 'ai';
        return 'noai';
      })();

  const currentImage = images[index % images.length];

  const saveTrial = async (trialData: any) => {
    if (!app || !app.userID) {
      console.warn('No userID, skipping save');
      return;
    }

    const trialDoc = {
      userID: app.userID,
      participantID: app.userID,
      phase: effectivePhase,
      trialNum: index + 1,
      imageID: currentImage,
      timestamp: serverTimestamp(),
      treatmentGroup: app.treatmentGroup,
      ...trialData,
    };

    try {
      // still keep a trials collection for trial-level logs
      await addDoc(collection(db, 'trials'), trialDoc);

      // Consolidate per-participant data under participants/{userID}
      const participantPayload: any = {
        userID: app.userID,
        sessionActive: true,
        currentPhase: effectivePhase,
        lastTrialAt: serverTimestamp(),
        // keep a trial_{n} entry for easy retrieval
        [`${effectivePhase}_trial_${index + 1}`]: {
          image: currentImage,
          ...trialData,
          savedAt: serverTimestamp(),
        },
        // and a trials_list map that groups trials by phase and number (analysis-friendly)
        trials_map: {
          [`${effectivePhase}_${index + 1}`]: {
            image: currentImage,
            ...trialData,
            savedAt: serverTimestamp(),
          },
        },
      };

      await setDoc(doc(db, 'participants', app.userID), participantPayload, { merge: true });
    } catch (err) {
      console.error('Failed to save trial', err);
    }
  };

  const handleComplete = async (data: any) => {
    await saveTrial(data);
    if (index + 1 >= trialsCount) {
      if (onFinish) {
        onFinish();
      } else {
        // default navigation after finishing trials: route to next phase
        // basic phase order to advance through: pretest -> baseline -> experiment -> posttest -> done
        const order = ['pretest', 'baseline', 'experiment', 'posttest', 'done'];
        const currentIdx = order.indexOf(effectivePhase);
        const next =
          currentIdx >= 0 && currentIdx < order.length - 1 ? order[currentIdx + 1] : 'done';
        if (next === 'done') {
          navigate('/done');
        } else {
          // navigate to group-specific landing page for the next phase
          const prefix =
            app && String(app.userID || '').startsWith('1') ? 'experimental' : 'control';
          navigate(`/${next}/${prefix}-landing`);
        }
      }
    } else {
      setIndex(index + 1);
    }
  };

  const aiExample = {
    aiPrediction: 'yes',
    aiBox: { x: 120, y: 80, width: 200, height: 150 },
    aiConfidence: 0.72,
  };

  return (
    <div className="min-h-screen p-6 bg-bg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {effectivePhase} ({effectiveMode === 'ai' ? 'AI' : 'No AI'})
        </h2>
        {effectiveMode === 'noai' ? (
          <NoAITrial key={`trial-${index}`} imageSrc={currentImage} onComplete={handleComplete} />
        ) : (
          <AITrial
            key={`trial-${index}`}
            imageSrc={currentImage}
            onComplete={handleComplete}
            aiPrediction={aiExample.aiPrediction as any}
            aiBox={aiExample.aiBox as any}
            aiConfidence={aiExample.aiConfidence}
          />
        )}
      </div>
    </div>
  );
}
