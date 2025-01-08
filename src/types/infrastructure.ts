import type { RatingLevel } from "./ratings";

export interface InfrastructureAspect {
  name: string;
  description: string;
  rating: RatingLevel;
  findings: string;
}