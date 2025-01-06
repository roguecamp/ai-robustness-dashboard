import type { CollaborationAspect } from "@/types/collaboration";

export const calculateScore = (aspects: CollaborationAspect[]): number => {
  console.log("Calculating collaboration score for aspects:", aspects);
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

export const calculateOverallRating = (aspects: CollaborationAspect[]): string => {
  const totalScore = calculateScore(aspects);
  console.log("Total collaboration score:", totalScore);
  
  if (totalScore >= 8) return "Largely in Place";
  if (totalScore >= 5) return "Somewhat in Place";
  return "Not in Place";
};