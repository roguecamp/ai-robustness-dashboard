import { RatingLevel } from "./ratings";

export interface DataAcquisitionAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
}