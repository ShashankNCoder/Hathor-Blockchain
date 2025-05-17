export function shouldMintFirstTipBadge(userTipCount: number): boolean {
  return userTipCount === 1;
}

export function shouldMintTopTippingBadge(totalTipped: number): boolean {
  return totalTipped >= 50;
}

