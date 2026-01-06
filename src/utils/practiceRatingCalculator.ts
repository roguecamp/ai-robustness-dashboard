import type { RatingLevel } from "@/types/ratings";

// Maps practice names to their database prefix for aspects
export const practiceToAspectPrefix: Record<string, string> = {
  // People pillar
  "Training and Upskilling": "Training:",
  "Collaboration": "Collaboration:",
  "Change Management": "ChangeManagement:",
  
  // Strategy pillar
  "Business Alignment": "Business:",
  "Scalability and Adoption": "Scalability:",
  "Innovation Framework": "Innovation:",
  
  // Data pillar
  "Data Acquisition and Quality": "Data Acquisition:",
  "Data Governance": "DataGovernance:",
  "Data Privacy": "DataPrivacy:",
  
  // Legal pillar
  "Intellectual Property": "IntellectualProperty:",
  "Ethical Considerations": "EthicalConsiderations:",
  "Compliance and Regulation": "ComplianceRegulation:",
  
  // Solution pillar
  "Infrastructure": "Infrastructure:",
  "Model Development and Training": "ModelDevelopment:",
  "Deployment and Monitoring": "DeploymentMonitoring:"
};

export const calculateRatingFromAspects = (aspectRatings: (string | null)[]): RatingLevel | null => {
  const validRatings = aspectRatings.filter((r): r is string => r !== null);
  
  if (validRatings.length === 0) {
    return null;
  }

  const ratingScores: Record<string, number> = {
    "Largely in Place": 2,
    "Somewhat in Place": 1,
    "Not in Place": 0
  };

  const totalScore = validRatings.reduce((sum, rating) => {
    return sum + (ratingScores[rating] ?? 0);
  }, 0);

  const maxScore = validRatings.length * 2;
  const percentage = (totalScore / maxScore) * 100;

  if (percentage >= 70) return "Largely in Place";
  if (percentage >= 30) return "Somewhat in Place";
  return "Not in Place";
};
