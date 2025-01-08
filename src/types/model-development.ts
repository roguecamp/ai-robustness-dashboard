export interface ModelDevelopmentAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
  findings: string;
}

export const modelDevelopmentAspects: ModelDevelopmentAspect[] = [
  {
    name: "Development Tools",
    description: "Availability and usability of tools for model development.",
    rating: null,
    findings: ""
  },
  {
    name: "Model Validation",
    description: "Robust processes for model validation and testing.",
    rating: null,
    findings: ""
  },
  {
    name: "Hyperparameter Tuning",
    description: "Efficient hyperparameter tuning to optimize model performance.",
    rating: null,
    findings: ""
  },
  {
    name: "Experiment Tracking",
    description: "Tools and processes for tracking model development experiments.",
    rating: null,
    findings: ""
  },
  {
    name: "Version Control",
    description: "Version control systems for models and training datasets.",
    rating: null,
    findings: ""
  },
  {
    name: "Resource Monitoring",
    description: "Monitoring resources during model training.",
    rating: null,
    findings: ""
  },
  {
    name: "Training Data",
    description: "Adequacy and relevance of training data.",
    rating: null,
    findings: ""
  }
];