export type RatingLevel = "Largely in Place" | "Somewhat in Place" | "Not in Place";

export interface KeyPractice {
  name: string;
  rating: RatingLevel | null;
  findings: string | null;
  owners: string | null;
}

export interface BaseAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
  owners: string;
}

export interface Pillar {
  title: string;
  description: string;
  color: string;
  keyPractices: KeyPractice[];
}