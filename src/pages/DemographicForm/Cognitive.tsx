import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { db } from '../../firebase';
import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import tokens from '../../../tokens.json';

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

        const participantRef = doc(db, 'participants', app.userID);
        const participantPayload: any = {
          userID: app.userID,
          cognitive: {
            responses: {},
            score: cognitiveScore,
            savedAt: serverTimestamp(),
          },
        };

        for (let i = 1; i <= 10; i++) {
          participantPayload.cognitive.responses[`q${i}`] = iqResponses[`q${i}`] ?? null;
        }

        await setDoc(participantRef, participantPayload, { merge: true });
      } catch (err) {
        console.error('Failed to save IQ score', err);
      } finally {
        // skip pretest: navigate to baseline landing based on user id/treatment
        // const prefix = app && String(app.userID || '').startsWith('1') ? 'experimental' : 'control';
        // navigate(`/baseline/${prefix}-landing`);
        navigate('../..//InstructionsPage/InstructionsPage');
      }
    })();
  };

  if (showCompletion) {
    // Extract tokens for inline styles
    const colors = tokens.colors;
    const shadows = tokens.shadows;
    const radii = tokens.radii;

    return (
      <main
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.surface} 100%)`,
        }}
      >
        <div
          className="max-w-4xl w-full"
          style={{
            backgroundColor: colors.bg,
            borderRadius: radii.xl,
            boxShadow: shadows.lg,
            overflow: 'hidden',
          }}
        >
          {/* Header Section with Gradient */}
          <div
            className="px-6 py-12 sm:px-10 sm:py-14 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors['accent-2']} 100%)`,
              color: '#ffffff',
            }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
              Radiológiai képértékelés
            </h1>
            <p className="text-lg opacity-90" style={{ color: '#ffffff' }}>
              Most kezdődik a fő feladat
            </p>
          </div>

          {/* Main Content */}
          <div className="px-6 py-10 sm:px-10 sm:py-12">
            {/* Tests Completed Card */}
            <div
              className="mb-8 p-6 rounded-xl"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.muted}`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                    A pszichológiai tesztek véget értek
                  </h3>
                  <p className="leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                    Köszönjük! A személyiség és kognitív tesztek elkészültek. Most következik a
                    kutatás fő része: orvosi képek értékelése.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next Card */}
            <div
              className="mb-8 p-6 rounded-xl"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.muted}`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: colors.accent, color: '#ffffff' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
                    Mi következik?
                  </h3>
                  <ul className="space-y-3" style={{ color: colors.text }}>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: colors.accent }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Bevezető előadás (5 perc):</strong> megtanulod, hogyan ismerd fel az
                        artritiszt radiológiai képeken
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: colors.accent }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>3 rész (3x30 kép):</strong> kipróbálhatod a feladatot
                        visszajelzéssel
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: colors.accent }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Kísérlet vége</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Reminder Warning Card */}
            <div
              className="mb-8 p-6 rounded-xl border-l-4"
              style={{
                backgroundColor: '#fef3c7',
                borderLeftColor: '#f59e0b',
                border: '1px solid #fde68a',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#92400e' }}>
                    Emlékeztető:
                  </h3>
                  <p className="mb-3 font-semibold" style={{ color: '#78350f' }}>
                    Az egész tesztet egyetlen ülésben, megszakítás nélkül kell elvégezni!
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCompleteClick}
                disabled={isSubmittingFinal}
                className="px-8 py-4 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSubmittingFinal ? colors.muted : colors.accent,
                  color: '#ffffff',
                }}
              >
                {isSubmittingFinal ? 'Betöltés...' : 'Kezdés az előadással →'}
              </button>
            </div>
          </div>
        </div>
      </main>
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
