export type EthicalConsiderationsAspect = {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
  findings: string;
};