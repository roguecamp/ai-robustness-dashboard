import { ComplianceRegulationAspect } from "@/types/compliance-regulation";
import { RatingLevel } from "@/types/ratings";

export const calculateOverallRating = (aspects: ComplianceRegulationAspect[]): RatingLevel | null => {
  const validRatings = aspects.filter(aspect => aspect.rating !== null);
  if (validRatings.length === 0) return null;

  const ratingScores = {
    "Largely in Place": 3,
    "Somewhat in Place": 2,
    "Not in Place": 1
  };

  const totalScore = validRatings.reduce((sum, aspect) => 
    sum + (aspect.rating ? ratingScores[aspect.rating] : 0), 0
  );
  
  const averageScore = totalScore / validRatings.length;

  if (averageScore >= 2.5) return "Largely in Place";
  if (averageScore >= 1.5) return "Somewhat in Place";
  return "Not in Place";
};