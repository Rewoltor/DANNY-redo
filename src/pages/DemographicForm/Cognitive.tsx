import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { db } from '../../firebase';
import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';

type CognitiveProps = {
  assessmentId?: string;
  personalityResponses?: string[];
  onComplete?: (responses: Record<string, number | null>, score: number) => void;
  isSubmittingFinal?: boolean;
};

export default function Cognitive({
  assessmentId: _assessmentId,
  personalityResponses: _personalityResponses,
  onComplete,
  isSubmittingFinal = false,
}: CognitiveProps) {
  const [question, setQuestion] = React.useState(1);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null as number | null);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [score, setScore] = React.useState(0);
  const [showCompletion, setShowCompletion] = React.useState(false);
  const [iqResponses, setIqResponses] = React.useState({} as Record<string, number | null>);
  const location = useLocation();
  const navigate = useNavigate();
  const app = useAppContext();

  React.useEffect(() => {
    // Reset timer whenever the question changes
    setTimeLeft(60);
    const timerId = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          // time ran out for this question
          clearInterval(timerId);
          handleNextQuestion(null);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [question]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex + 1);
  };

  const handleNextQuestion = (answer: number | null) => {
    const questionKey = `q${question}`;
    const updatedResponses = {
      ...iqResponses,
      [questionKey]: answer === null ? 0 : answer,
    };
    setIqResponses(updatedResponses);

    if (answer !== null) {
      setScore((prev: number) => prev + 1);
    }

    setSelectedAnswer(null);
    setTimeLeft(60);

    if (question < 10) {
      setQuestion((prev: number) => prev + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const handleCompleteClick = () => {
    if (onComplete) onComplete(iqResponses, score);
    (async () => {
      try {
        if (!app || !app.userID) {
          console.warn('No active participant; skipping IQ save');
          navigate('/pretest');
          return;
        }

        // Correct answers as provided
        const correctAnswers: Record<string, number> = {
          q1: 1,
          q2: 2,
          q3: 3,
          q4: 5,
          q5: 1,
          q6: 6,
          q7: 4,
          q8: 3,
          q9: 6,
          q10: 3,
        };

        // compute score based on exact matches
        let cognitiveScore = 0;
        for (let i = 1; i <= 10; i++) {
          const key = `q${i}`;
          const given = iqResponses[key];
          if (given !== null && given !== undefined && given === correctAnswers[key])
            cognitiveScore++;
        }

        const resultDocRef = doc(db, 'participant_results', app.userID);
        const answersDocRef = doc(db, 'answers', app.userID);

        const answersPayload: any = { userID: app.userID, cognitive_responses: {} };
        for (let i = 1; i <= 10; i++) {
          answersPayload.cognitive_responses[`q${i}`] = iqResponses[`q${i}`] ?? null;
        }
        answersPayload.cognitiveSavedAt = serverTimestamp();

        const resultPayload: any = {
          userID: app.userID,
          cognitive_score: cognitiveScore,
          cognitiveSavedAt: serverTimestamp(),
        };

        // Save raw answers and results (merge)
        await setDoc(answersDocRef, answersPayload, { merge: true });
        await setDoc(resultDocRef, resultPayload, { merge: true });
      } catch (err) {
        console.error('Failed to save IQ score', err);
      } finally {
        navigate('/pretest');
      }
    })();
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 font-sans text-text">
        <div className="w-full max-w-md bg-surface p-10 md:p-12 rounded-3xl shadow-2xl border border-muted text-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text">Siker!</h1>
          </div>
          <div className="space-y-4 text-lg text-text">
            <p>Köszönjük a részvételt!</p>
            <p>Küldd be nekünk a tesztet</p>
          </div>
          <button
            className="w-full mt-8 py-3 px-8 text-lg font-semibold text-white bg-accent rounded-lg shadow hover:bg-accent-2 transition duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleCompleteClick}
            disabled={isSubmittingFinal}
          >
            {isSubmittingFinal ? 'Beküldés...' : 'Beküld'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 font-sans text-text">
      <div className="w-full max-w-3xl bg-surface p-10 md:p-12 rounded-3xl shadow-2xl border border-muted relative">
        <div className="pb-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
              Kérdés {question} / 10
            </h1>
            <p className="text-lg text-text">
              Válaszd ki azt a képet amelyik a legjobban beleillik a fenti képbe
            </p>
          </div>

          <div className="w-28 h-20 shrink-0 bg-muted p-3 rounded-xl shadow-sm mt-6 sm:mt-0">
            <h3 className="text-xs font-semibold text-center text-text mb-1">Hátralévő idő</h3>
            <div className="w-full bg-accent-2/10 rounded-full h-2 mb-1">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
            <p className="text-sm font-medium text-center text-text">{timeLeft} mp</p>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          <div className="flex justify-center mb-4">
            <div className="w-full overflow-hidden rounded-xl shadow-lg border border-muted">
              <img
                src={`/cognitivePics/${question}.png`}
                alt={`Question ${question}`}
                className="w-full h-auto object-contain mx-auto"
                style={{ maxHeight: '45vh' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg mx-auto">
            {[1, 2, 3, 4, 5, 6].map(idx => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx - 1)}
                className={`rounded-xl shadow-md overflow-hidden relative transition-all duration-200 transform hover:scale-105 ${
                  selectedAnswer === idx
                    ? 'ring-4 ring-accent border-2 border-white'
                    : 'border-2 border-transparent'
                }`}
              >
                <div className="w-full pt-[60%] relative">
                  <img
                    src={`/cognitivePics/${question}.${idx}.png`}
                    alt={`Option ${idx}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  {selectedAnswer === idx && (
                    <div className="absolute inset-0 bg-accent opacity-20" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNextQuestion(selectedAnswer)}
            disabled={selectedAnswer === null}
            className="w-full mt-8 py-3 px-8 text-lg font-semibold text-white bg-accent rounded-lg shadow hover:bg-accent-2 transition duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {question < 10 ? 'Következő' : 'Mehet'}
          </button>
        </div>
      </div>
    </div>
  );
}
