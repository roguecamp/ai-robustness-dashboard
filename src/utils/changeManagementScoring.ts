import type { ChangeManagementAspect } from "@/types/change-management";

export const calculateScore = (aspects: ChangeManagementAspect[]): number => {
  console.log("Calculating change management score for aspects:", aspects);
  return aspects.reduce((sum, aspect) => {
    switch (aspect.rating) {
      case "Largely in Place":
        return sum + 2;
      case "Somewhat in Place":
        return sum + 1;
      case "Not in Place":
      default:
        return sum + 0;
    }
  }, 0);
};

export const calculateOverallRating = (aspects: ChangeManagementAspect[]): string => {
  const totalScore = calculateScore(aspects);
  console.log("Total change management score:", totalScore);
  
  if (totalScore >= 8) return "Largely in Place";
  if (totalScore >= 5) return "Somewhat in Place";
  return "Not in Place";
};