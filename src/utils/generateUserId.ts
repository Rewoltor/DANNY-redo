export function generateUserID() {
  const isInTreatmentGroup = Math.random() < 0.5;
  const groupPrefix = isInTreatmentGroup ? '1' : '0';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomSuffix = '';
  for (let i = 0; i < 9; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    userID: groupPrefix + randomSuffix,
    treatmentGroup: isInTreatmentGroup ? 'treatment' : 'control',
    randomizationSeed: Math.floor(Math.random() * 1000000),
  };
}
