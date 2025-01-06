import { RatingLevel } from "@/types/ratings";
import { DeploymentMonitoringAspect } from "@/types/deployment-monitoring";

export const calculateDeploymentMonitoringRating = (aspects: DeploymentMonitoringAspect[]): RatingLevel => {
  const ratingScores = {
    "Largely in Place": 2,
    "Somewhat in Place": 1,
    "Not in Place": 0
  };

  const totalScore = aspects.reduce((sum, aspect) => {
    return sum + (aspect.rating ? ratingScores[aspect.rating] : 0);
  }, 0);

  const maxScore = aspects.length * 2;
  const percentage = (totalScore / maxScore) * 100;

  if (percentage >= 70) return "Largely in Place";
  if (percentage >= 30) return "Somewhat in Place";
  return "Not in Place";
};