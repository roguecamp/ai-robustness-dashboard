export interface IntellectualPropertyAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place";
  findings?: string;
}