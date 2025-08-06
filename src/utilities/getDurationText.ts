// Convert duration from weeks to months and weeks 
export const getDurationText = (weeks: number) => {
  const months = Math.floor(weeks / 4);
  const remainingWeeks = weeks % 4;

  if (months === 0) return `${weeks} weeks`;
  if (remainingWeeks === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''} and ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}`;
};