/** Game B: time-based scoring. remainingMs out of totalMs. */
export function hotOrNotScore(remainingMs: number, totalMs: number): number {
  return Math.round(100 * (remainingMs / totalMs));
}

/** Game A: base 500 + 100 sleuth bonus if clues match. */
export function contextClueScore(correct: boolean, cluesMatch: boolean): number {
  if (!correct) return 0;
  return 500 + (cluesMatch ? 100 : 0);
}

/** Game C: partial credit based on correct pairwise orderings out of 6 total. */
export function intensityScore(userOrder: string[], correctOrder: string[]): number {
  let correctPairs = 0;
  const totalPairs = 6; // C(4,2) = 6
  for (let i = 0; i < userOrder.length; i++) {
    for (let j = i + 1; j < userOrder.length; j++) {
      const userA = correctOrder.indexOf(userOrder[i]);
      const userB = correctOrder.indexOf(userOrder[j]);
      if (userA < userB) correctPairs++;
    }
  }
  return Math.round(400 * (correctPairs / totalPairs));
}

/** Game D: 400 points if correct imposter identified. */
export function synonymSwapScore(correct: boolean): number {
  return correct ? 400 : 0;
}

/** Game E: points based on how many of 3 words were found. */
export function passkeysScore(wordsFound: number): number {
  if (wordsFound === 3) return 500;
  if (wordsFound === 2) return 300;
  if (wordsFound === 1) return 100;
  return 0;
}
