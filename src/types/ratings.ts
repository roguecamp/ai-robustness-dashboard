export type RatingLevel = "Largely in Place" | "Somewhat in Place" | "Not in Place";

export interface KeyPractice {
  name: string;
  rating: RatingLevel | null;
  findings: string | null;
}

export interface Pillar {
  title: string;
  description: string;
  color: string;
  keyPractices: KeyPractice[];
}