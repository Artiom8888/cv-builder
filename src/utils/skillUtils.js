export const getSkillLevelLabel = (value) => {
  if (value < 25) return 'Beginner';
  if (value < 50) return 'Intermediate';
  if (value < 75) return 'Advanced';
  return 'Expert';
};