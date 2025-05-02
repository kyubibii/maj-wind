export function proceedToNextRound(round: number, ju: number): { round: number; ju: number } {
  if (ju < 3) {
    ju += 1
  } else {
    ju = 0
    round += 1
  }
  return { round, ju }
}
