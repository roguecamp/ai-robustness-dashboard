export interface TrainingAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
  findings: string;
}

export const trainingAspects: TrainingAspect[] = [
  {
    name: "Employee AI Literacy",
    description: "Level of understanding and ability to work alongside AI technologies.",
    rating: null,
    findings: ""
  },
  {
    name: "Training Programs",
    description: "Availability and effectiveness of AI training and upskilling programs.",
    rating: null,
    findings: ""
  },
  {
    name: "AI Adoption Rate",
    description: "Employees are encouraged to and are adopting and utilizing AI solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "Continuous Learning",
    description: "Opportunities for continuous learning and upskilling in AI.",
    rating: null,
    findings: ""
  },
  {
    name: "Performance Metrics",
    description: "Metrics to measure the effectiveness of training programs.",
    rating: null,
    findings: ""
  },
  {
    name: "Certification Levels",
    description: "Attainment of certifications in relevant AI domains.",
    rating: null,
    findings: ""
  },
  {
    name: "Expertise Availability",
    description: "Access to in-house or external AI experts for guidance.",
    rating: null,
    findings: ""
  }
];