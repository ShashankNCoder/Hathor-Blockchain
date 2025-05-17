export function hasAccessBasedOnBalance(balance: number, required: number): boolean {
  return balance >= required;
}

export function hasRequiredAccess(userBalance: number, minRequired: number): boolean {
  return userBalance >= minRequired;
}
