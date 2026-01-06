import type { RatingLevel } from "@/types/ratings";

export const RATING_LEVELS: RatingLevel[] = [
  "Largely in Place",
  "Somewhat in Place",
  "Not in Place"
];

export const getRatingColor = (rating: RatingLevel | null): string => {
  switch (rating) {
    case "Largely in Place":
      return "bg-green-700 text-white";
    case "Somewhat in Place":
      return "bg-yellow-400";
    case "Not in Place":
      return "bg-red-300";
    default:
      return "bg-gray-100 border border-gray-200";
  }
};

export const getNextRating = (currentRating: RatingLevel | null): RatingLevel => {
  const currentIndex = currentRating ? RATING_LEVELS.indexOf(currentRating) : -1;
  return RATING_LEVELS[(currentIndex + 1) % RATING_LEVELS.length];
};

export const calculateOverallRating = (ratings: (RatingLevel | null)[]): RatingLevel | null => {
  const validRatings = ratings.filter((r): r is RatingLevel => r !== null);
  
  if (validRatings.length === 0) {
    return null;
  }

  const ratingScores: Record<RatingLevel, number> = {
    "Largely in Place": 2,
    "Somewhat in Place": 1,
    "Not in Place": 0
  };

  const totalScore = validRatings.reduce((sum, rating) => sum + ratingScores[rating], 0);
  const maxScore = validRatings.length * 2;
  const percentage = (totalScore / maxScore) * 100;

  if (percentage >= 70) return "Largely in Place";
  if (percentage >= 30) return "Somewhat in Place";
  return "Not in Place";
};
