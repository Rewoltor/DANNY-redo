import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function exportTrialsToCSV() {
  const participants = await getDocs(collection(db, 'participants'));

  const rows: any[] = [];

  participants.docs.forEach(pDoc => {
    const data = pDoc.data();
    const userID = data.userID || pDoc.id;
    const treatmentGroup = data.treatmentGroup || '';
    const big5 = data.big5_scores || {};

    const trials = data.trials || {};
    Object.keys(trials).forEach(trialKey => {
      const trial = trials[trialKey];
      rows.push({
        participant_id: userID,
        treatment_group: treatmentGroup,
        big5_O: big5.O ?? '',
        big5_C: big5.C ?? '',
        big5_E: big5.E ?? '',
        big5_A: big5.A ?? '',
        big5_N: big5.N ?? '',
        phase: trial.phase,
        trial_num: trial.trialNum,
        image_id: trial.imageID,
        response: trial.response ?? '',
        correct_label: trial.correct_label ?? '',
        confidence: trial.confidence ?? '',
        time_sec: trial.time_sec ?? '',
        bbox_iou: trial.bbox_iou ?? '',
        ai_prediction: trial.ai_prediction ?? '',
        ai_confidence: trial.ai_confidence ?? '',
        decision_revised_after_ai: trial.decision_revised_after_ai ?? '',
      });
    });
  });

  return convertToCSV(rows);
}

function convertToCSV(data: any[]) {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const lines = [headers.join(',')];
  data.forEach(row => {
    const vals = headers.map(h => {
      const v = row[h];
      if (v === null || v === undefined) return '';
      // escape quotes
      const s = String(v).replace(/"/g, '""');
      if (s.includes(',') || s.includes('\n')) return `"${s}"`;
      return s;
    });
    lines.push(vals.join(','));
  });
  return lines.join('\n');
}
