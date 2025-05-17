export function calculateScore(tipsGiven: number, badgesEarned: number): number {
  return (tipsGiven * 2) + (badgesEarned * 5);
}

