import * as React from 'react';
import NoAITrial from './NoAITrial';
import AITrial from './AITrial';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';

export default function TestScreenContainer({
  phase,
  mode, // 'ai' | 'noai'
  poolFolder,
  trialsCount = 10,
  onFinish,
}: {
  phase: string;
  mode: 'ai' | 'noai';
  poolFolder: string; // e.g., 'screening' or 'baseline'
  trialsCount?: number;
  onFinish?: () => void;
}) {
  const app = useAppContext();
  const [index, setIndex] = (React as any).useState(0);
  const [images, setImages] = (React as any).useState([]);

  React.useEffect(() => {
    // load images 1..10 from public/annotation/<poolFolder>
    const imgs = [];
    for (let i = 1; i <= 10; i++) imgs.push(`/annotation/${poolFolder}/${i}.png`);
    setImages(imgs);
  }, [poolFolder]);

  const currentImage = images[index % images.length];

  const saveTrial = async (trialData: any) => {
    if (!app || !app.userID) {
      console.warn('No userID, skipping save');
      return;
    }

    const trialDoc = {
      participantID: app.userID,
      phase,
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
        currentPhase: phase,
        lastTrialAt: serverTimestamp(),
        // keep a trial_{n} entry for easy retrieval
        [`trial_${index + 1}`]: {
          image: currentImage,
          ...trialData,
          savedAt: serverTimestamp(),
        },
        // and a trials_list map that groups trials by number (analysis-friendly)
        trials_list: {
          [`${index + 1}`]: {
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
        // default navigation after finishing trials
        try {
          // navigate to pretest route if available
          window.location.href = '/pretest';
        } catch (e) {
          console.log('Finished trials');
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
          {phase} ({mode === 'ai' ? 'AI' : 'No AI'})
        </h2>
        {mode === 'noai' ? (
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
