import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function saveIQScore(
  userID: string,
  score: number,
  testType: string,
  testIndex: number,
) {
  const iqKey = `test_${testIndex}`;

  await setDoc(
    doc(db, 'participants', userID),
    {
      iq_scores: {
        [iqKey]: {
          score,
          test_type: testType,
          timestamp: serverTimestamp(),
        },
      },
      lastUpdated: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function savePersonalityResponse(
  userID: string,
  questionIndex: number,
  response: number,
  trait: string,
  questionText?: string,
) {
  const qKey = `q_${questionIndex}`;

  await setDoc(
    doc(db, 'participants', userID),
    {
      personality_responses: {
        [qKey]: {
          question_id: questionIndex,
          response,
          trait,
          question_text: questionText,
          timestamp: serverTimestamp(),
        },
      },
      lastUpdated: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveBig5Scores(
  userID: string,
  scores: { O: number; C: number; E: number; A: number; N: number },
) {
  await setDoc(
    doc(db, 'participants', userID),
    {
      big5_scores: scores,
      personality_completed_at: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    },
    { merge: true },
  );
}
