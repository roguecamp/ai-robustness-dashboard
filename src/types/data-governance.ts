export type DataGovernanceAspect = {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
};

export type DataGovernanceRating = {
  projectName: string;
  assessmentDate: string;
  aspects: DataGovernanceAspect[];
};