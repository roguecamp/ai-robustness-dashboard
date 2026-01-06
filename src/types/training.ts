export interface TrainingAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
  findings: string;
  owners: string;
}

export const trainingAspects: TrainingAspect[] = [
  {
    name: "Employee AI Literacy",
    description: "Level of understanding and ability to work alongside AI technologies.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Training Programs",
    description: "Availability and effectiveness of AI training and upskilling programs.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "AI Adoption Rate",
    description: "Employees are encouraged to and are adopting and utilizing AI solutions.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Continuous Learning",
    description: "Opportunities for continuous learning and upskilling in AI.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Performance Metrics",
    description: "Metrics to measure the effectiveness of training programs.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Certification Levels",
    description: "Attainment of certifications in relevant AI domains.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Expertise Availability",
    description: "Access to in-house or external AI experts for guidance.",
    rating: null,
    findings: "",
    owners: ""
  }
];
