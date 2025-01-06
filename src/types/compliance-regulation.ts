export interface ComplianceRegulationAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
}