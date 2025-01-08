import type { RatingLevel } from "./ratings";

export interface IntellectualPropertyAspect {
  name: string;
  description: string;
  rating: RatingLevel;
  findings: string;
}