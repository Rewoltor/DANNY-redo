/**
 * Binary response type for yes/no and positive/negative decisions
 * 0 = no/negative, 1 = yes/positive
 */
export type BinaryResponse = 0 | 1;

/**
 * Converts a numeric binary response to Hungarian yes/no label
 * @param value - 0 for "nem" (no), 1 for "igen" (yes)
 * @returns Hungarian label string
 */
export function getDecisionLabel(value: BinaryResponse): 'igen' | 'nem' {
  return value === 1 ? 'igen' : 'nem';
}

/**
 * Converts a numeric prediction value to Hungarian positive/negative label
 * @param value - 0 for "negatív" (negative), 1 for "pozitív" (positive)
 * @returns Hungarian prediction label string
 */
export function getPredictionLabel(value: BinaryResponse): 'negatív' | 'pozitív' {
  return value === 1 ? 'pozitív' : 'negatív';
}

/**
 * Converts string decision values to numeric binary response
 * Handles both English and Hungarian variants
 * @param value - String value to convert ("yes"/"igen" or "no"/"nem")
 * @returns 0 or 1
 */
export function decisionToNumber(value: string): BinaryResponse {
  const normalized = value.toLowerCase();
  return normalized === 'yes' || normalized === 'igen' ? 1 : 0;
}
