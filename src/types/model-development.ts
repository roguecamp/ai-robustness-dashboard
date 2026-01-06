export interface ModelDevelopmentAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
  findings: string;
  owners: string;
}

export const modelDevelopmentAspects: ModelDevelopmentAspect[] = [
  {
    name: "Development Tools",
    description: "Availability and usability of tools for model development.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Model Validation",
    description: "Robust processes for model validation and testing.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Hyperparameter Tuning",
    description: "Efficient hyperparameter tuning to optimize model performance.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Experiment Tracking",
    description: "Tools and processes for tracking model development experiments.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Version Control",
    description: "Version control systems for models and training datasets.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Resource Monitoring",
    description: "Monitoring resources during model training.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Training Data",
    description: "Adequacy and relevance of training data.",
    rating: null,
    findings: "",
    owners: ""
  }
];
