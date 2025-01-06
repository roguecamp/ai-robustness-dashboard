import type { DataPrivacyAspect } from "@/types/data-privacy";

export const calculateOverallRating = (aspects: DataPrivacyAspect[]) => {
  const validRatings = aspects.filter(aspect => aspect.rating !== null);
  if (validRatings.length === 0) return null;

  const ratingCounts = {
    "Largely in Place": 0,
    "Somewhat in Place": 0,
    "Not in Place": 0
  };

  validRatings.forEach(aspect => {
    if (aspect.rating) ratingCounts[aspect.rating]++;
  });

  const totalRatings = validRatings.length;
  
  if (ratingCounts["Largely in Place"] / totalRatings >= 0.7) {
    return "Largely in Place";
  } else if (ratingCounts["Not in Place"] / totalRatings >= 0.3) {
    return "Not in Place";
  } else {
    return "Somewhat in Place";
  }
};