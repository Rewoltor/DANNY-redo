// Adapted personality calculation utilities

// Helper function to calculate percentiles
function calculatePercentile(value: number, normativeData: number[]): number {
  if (normativeData.length === 0) {
    return 50; // Default to 50th percentile if no normative data
  }
  const lowerCount = normativeData.filter(v => v < value).length;
  const equalCount = normativeData.filter(v => v === value).length;
  const percentile = Math.round(((lowerCount + 0.5 * equalCount) / normativeData.length) * 100);
  return percentile;
}

// Subscale calculation functions (indices are 0-based for responses array length 100)
function calculateWithdrawal(responses: number[]): number {
  return (
    -responses[0] +
    responses[10] +
    -responses[20] +
    responses[30] +
    -responses[40] +
    responses[50] +
    responses[60] +
    -responses[70] +
    responses[80] +
    responses[90] +
    14
  );
}
function calculateCompassion(responses: number[]): number {
  return (
    -responses[1] +
    responses[11] +
    responses[21] +
    -responses[31] +
    responses[41] +
    -responses[51] +
    -responses[61] +
    responses[71] +
    -responses[81] +
    responses[91] +
    20
  );
}
function calculateIndustriousness(responses: number[]): number {
  return (
    responses[2] +
    -responses[12] +
    -responses[22] +
    -responses[32] +
    -responses[33] +
    responses[42] +
    -responses[52] +
    responses[62] +
    responses[72] +
    -responses[82] +
    -responses[92] +
    26
  );
}
function calculateEnthusiasm(responses: number[]): number {
  return (
    responses[3] +
    -responses[13] +
    -responses[23] +
    -responses[33] +
    responses[43] +
    -responses[53] +
    -responses[63] +
    responses[73] +
    responses[83] +
    responses[93] +
    20
  );
}
function calculateIntellect(responses: number[]): number {
  return (
    responses[4] +
    -responses[14] +
    responses[24] +
    responses[34] +
    -responses[44] +
    -responses[54] +
    responses[64] +
    responses[74] +
    -responses[84] +
    responses[94] +
    14
  );
}
function calculateVolatility(responses: number[]): number {
  return (
    responses[5] +
    -responses[15] +
    responses[25] +
    -responses[35] +
    responses[45] +
    -responses[55] +
    responses[65] +
    -responses[75] +
    responses[85] +
    responses[95] +
    14
  );
}
function calculatePoliteness(responses: number[]): number {
  return (
    responses[6] +
    -responses[16] +
    responses[26] +
    -responses[36] +
    responses[46] +
    responses[56] +
    -responses[66] +
    -responses[76] +
    -responses[86] +
    responses[96] +
    20
  );
}
function calculateOrderliness(responses: number[]): number {
  return (
    -responses[7] +
    responses[17] +
    responses[27] +
    responses[37] +
    -responses[47] +
    responses[57] +
    -responses[67] +
    -responses[77] +
    -responses[87] +
    responses[97] +
    20
  );
}
function calculateAssertiveness(responses: number[]): number {
  return (
    responses[8] +
    responses[18] +
    -responses[28] +
    responses[38] +
    -responses[48] +
    responses[58] +
    responses[68] +
    -responses[78] +
    responses[88] +
    -responses[98] +
    14
  );
}
function calculateOpennessSubtrait(responses: number[]): number {
  return (
    responses[9] +
    responses[19] +
    responses[29] +
    responses[39] +
    -responses[49] +
    -responses[59] +
    responses[69] +
    -responses[79] +
    -responses[89] +
    responses[99] +
    14
  );
}

// Percentile helper wrappers (use the same normative arrays as in the attachment)
function calculateOpennessPercentile(value: number): number {
  const normativeData = [
    39, 54, 27, 33, 48, 36, 25, 52, 46, 50, 44, 62, 21, 58, 27, 45, 43, 46, 62, 29, 56, 30, 39, 41,
    58, 29, 35, 56, 36,
  ];
  return calculatePercentile(value, normativeData);
}
function calculateConscientiousnessPercentile(value: number): number {
  const normativeData = [
    26, 45, 37, 42, 45, 41, 42, 37, 42, 49, 44, 44, 41, 35, 45, 45, 44, 40, 45, 43, 44, 36, 43, 28,
    27, 39, 40, 49, 32,
  ];
  return calculatePercentile(value, normativeData);
}
function calculateExtroversionPercentile(value: number): number {
  const normativeData = [
    10, 73, 45, 38, 45, 43, 24, 53, 52, 65, 64, 42, 39, 39, 47, 57, 42, 42, 45, 39, 68, 32, 39, 42,
    43, 57, 38, 63, 50,
  ];
  return calculatePercentile(value, normativeData);
}
function calculateAgreeablenessPercentile(value: number): number {
  const normativeData = [
    36, 33, 6, 18, 29, 29, 16, 22, 25, 31, 28, 43, 24, 12, 34, 35, 42, 37, 32, 31, 27, 24, 19, 2,
    15, 25, 34, 44, 16,
  ];
  return calculatePercentile(value, normativeData);
}
function calculateNeuroticismPercentile(value: number): number {
  const normativeData = [
    35, 10, 29, 16, 27, 32, 22, 27, 38, 26, 32, 40, 27, 38, 26, 36, 39, 30, 37, 28, 38, 29, 28, 20,
    29, 11, 30, 17, 42,
  ];
  return calculatePercentile(value, normativeData);
}
function calculateWithdrawalPercentile(value: number): number {
  const normativeData = [29, 27, 29, 25, 31, 25, 28, 37, 23, 32, 38, 28, 29, 31, 35];
  return calculatePercentile(value, normativeData);
}
function calculateCompassionPercentile(value: number): number {
  const normativeData = [31, 27, 27, 27, 29, 31, 24, 33, 22, 29, 29, 27, 30, 33, 30];
  return calculatePercentile(value, normativeData);
}
function calculateIndustriousnessPercentile(value: number): number {
  const normativeData = [38, 33, 36, 38, 31, 32, 35, 33, 22, 37, 33, 28, 34, 33, 29];
  return calculatePercentile(value, normativeData);
}
function calculateEnthusiasmPercentile(value: number): number {
  const normativeData = [39, 37, 28, 34, 31, 26, 33, 38, 22, 35, 33, 32, 33, 32, 30];
  return calculatePercentile(value, normativeData);
}
function calculateIntellectPercentile(value: number): number {
  const normativeData = [38, 30, 31, 33, 24, 38, 39, 32, 22, 32, 31, 29, 32, 29, 33];
  return calculatePercentile(value, normativeData);
}
function calculateVolatilityPercentile(value: number): number {
  const normativeData = [34, 27, 31, 30, 29, 27, 30, 29, 22, 36, 32, 34, 28, 33, 28];
  return calculatePercentile(value, normativeData);
}
function calculatePolitenessPercentile(value: number): number {
  const normativeData = [28, 24, 25, 29, 24, 32, 24, 32, 22, 35, 29, 32, 28, 30, 26];
  return calculatePercentile(value, normativeData);
}
function calculateOrderlinessPercentile(value: number): number {
  const normativeData = [32, 34, 24, 37, 29, 33, 31, 35, 22, 34, 33, 32, 32, 34, 29];
  return calculatePercentile(value, normativeData);
}
function calculateAssertivenessPercentile(value: number): number {
  const normativeData = [38, 30, 26, 31, 31, 35, 35, 28, 21, 32, 32, 27, 33, 28, 31];
  return calculatePercentile(value, normativeData);
}
function calculateOpennessSubtraitPercentile(value: number): number {
  const normativeData = [38, 32, 22, 29, 40, 38, 37, 36, 21, 34, 30, 30, 33, 31, 31];
  return calculatePercentile(value, normativeData);
}

// Main calculation function for personality
export function calculatePersonalityScores(responses: string[]) {
  const numericResponses = responses.map(r => parseInt(r, 10));

  const withdrawal = calculateWithdrawal(numericResponses);
  const compassion = calculateCompassion(numericResponses);
  const industriousness = calculateIndustriousness(numericResponses);
  const enthusiasm = calculateEnthusiasm(numericResponses);
  const intellect = calculateIntellect(numericResponses);
  const volatility = calculateVolatility(numericResponses);
  const politeness = calculatePoliteness(numericResponses);
  const orderliness = calculateOrderliness(numericResponses);
  const assertiveness = calculateAssertiveness(numericResponses);
  const openness_trait = calculateOpennessSubtrait(numericResponses);

  const neuroticism = withdrawal + volatility;
  const agreeableness = compassion + politeness;
  const conscientiousness = industriousness + orderliness;
  const extroversion = enthusiasm + assertiveness;
  const openness = intellect + openness_trait;

  const openness_percentile = calculateOpennessPercentile(openness);
  const conscientiousness_percentile = calculateConscientiousnessPercentile(conscientiousness);
  const extroversion_percentile = calculateExtroversionPercentile(extroversion);
  const agreeableness_percentile = calculateAgreeablenessPercentile(agreeableness);
  const neuroticism_percentile = calculateNeuroticismPercentile(neuroticism);

  const withdrawal_percentile = calculateWithdrawalPercentile(withdrawal);
  const compassion_percentile = calculateCompassionPercentile(compassion);
  const industriousness_percentile = calculateIndustriousnessPercentile(industriousness);
  const enthusiasm_percentile = calculateEnthusiasmPercentile(enthusiasm);
  const intellect_percentile = calculateIntellectPercentile(intellect);
  const volatility_percentile = calculateVolatilityPercentile(volatility);
  const politeness_percentile = calculatePolitenessPercentile(politeness);
  const orderliness_percentile = calculateOrderlinessPercentile(orderliness);
  const assertiveness_percentile = calculateAssertivenessPercentile(assertiveness);
  const openness_trait_percentile = calculateOpennessSubtraitPercentile(openness_trait);

  return {
    openness,
    conscientiousness,
    extroversion,
    agreeableness,
    neuroticism,

    withdrawal,
    compassion,
    industriousness,
    enthusiasm,
    intellect,
    volatility,
    politeness,
    orderliness,
    assertiveness,
    openness_trait,

    openness_percentile,
    conscientiousness_percentile,
    extroversion_percentile,
    agreeableness_percentile,
    neuroticism_percentile,

    withdrawal_percentile,
    compassion_percentile,
    industriousness_percentile,
    enthusiasm_percentile,
    intellect_percentile,
    volatility_percentile,
    politeness_percentile,
    orderliness_percentile,
    assertiveness_percentile,
    openness_trait_percentile,
  };
}

// Simple major-five calculator: returns summed major traits (no percentiles)
export function calculateBig5Major(responses: string[]) {
  const numericResponses = responses.map(r => parseInt(r, 10));

  const withdrawal = calculateWithdrawal(numericResponses);
  const compassion = calculateCompassion(numericResponses);
  const industriousness = calculateIndustriousness(numericResponses);
  const enthusiasm = calculateEnthusiasm(numericResponses);
  const intellect = calculateIntellect(numericResponses);
  const volatility = calculateVolatility(numericResponses);
  const politeness = calculatePoliteness(numericResponses);
  const orderliness = calculateOrderliness(numericResponses);
  const assertiveness = calculateAssertiveness(numericResponses);
  const openness_trait = calculateOpennessSubtrait(numericResponses);

  const neuroticism = withdrawal + volatility;
  const agreeableness = compassion + politeness;
  const conscientiousness = industriousness + orderliness;
  const extroversion = enthusiasm + assertiveness;
  const openness = intellect + openness_trait;

  return {
    openness,
    conscientiousness,
    extroversion,
    agreeableness,
    neuroticism,
  };
}
