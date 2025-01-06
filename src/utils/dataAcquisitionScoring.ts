import type { DataAcquisitionAspect } from "@/types/data-acquisition";
import type { RatingLevel } from "@/types/ratings";

export const calculateOverallRating = (aspects: DataAcquisitionAspect[]): RatingLevel => {
  const validRatings = aspects.filter(aspect => aspect.rating !== null);
  if (validRatings.length === 0) return "Not in Place";

  const ratingCounts = {
    "Largely in Place": 0,
    "Somewhat in Place": 0,
    "Not in Place": 0
  };

  validRatings.forEach(aspect => {
    if (aspect.rating) {
      ratingCounts[aspect.rating]++;
    }
  });

  const totalRatings = validRatings.length;
  const largelyInPlacePercentage = (ratingCounts["Largely in Place"] / totalRatings) * 100;
  const somewhatInPlacePercentage = (ratingCounts["Somewhat in Place"] / totalRatings) * 100;

  if (largelyInPlacePercentage >= 70) return "Largely in Place";
  if (largelyInPlacePercentage + somewhatInPlacePercentage >= 70) return "Somewhat in Place";
  return "Not in Place";
};