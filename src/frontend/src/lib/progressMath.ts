export function getNextIncompleteDay(completedDays: bigint[]): number | null {
  const completedSet = new Set(completedDays.map((d) => Number(d)));
  
  for (let day = 1; day <= 30; day++) {
    if (!completedSet.has(day)) {
      return day;
    }
  }
  
  return null; // All days completed
}

export function calculateStreak(completedDays: bigint[]): number {
  if (completedDays.length === 0) return 0;
  
  const sorted = completedDays.map((d) => Number(d)).sort((a, b) => a - b);
  let streak = 1;
  
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] - sorted[i - 1] === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getCompletionPercentage(completedDays: bigint[]): number {
  return Math.round((completedDays.length / 30) * 100);
}
