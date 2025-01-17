import type { RatingLevel } from "./ratings";

export interface InfrastructureAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
}