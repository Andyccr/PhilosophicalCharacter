export type AssessmentItem = {
  id: string;
  prompt: string;
  theme: string;
  rationale: string;
  options: Array<{ id: string; label: string }>;
};

/** Stay on the last item; otherwise move one step forward. */
export function nextIndexAfterChoice(index: number, total: number): number {
  if (total <= 0) return 0;
  const last = Math.max(0, total - 1);
  if (index >= last) return last;
  if (index < 0) return 0;
  return index + 1;
}
