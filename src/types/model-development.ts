export interface ModelDevelopmentAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
}

export const modelDevelopmentAspects: ModelDevelopmentAspect[] = [
  {
    name: "Development Tools",
    description: "Availability and usability of tools for model development.",
    rating: null
  },
  {
    name: "Model Validation",
    description: "Robust processes for model validation and testing.",
    rating: null
  },
  {
    name: "Hyperparameter Tuning",
    description: "Efficient hyperparameter tuning to optimize model performance.",
    rating: null
  },
  {
    name: "Experiment Tracking",
    description: "Tools and processes for tracking model development experiments.",
    rating: null
  },
  {
    name: "Version Control",
    description: "Version control systems for models and training datasets.",
    rating: null
  },
  {
    name: "Resource Monitoring",
    description: "Monitoring resources during model training.",
    rating: null
  },
  {
    name: "Training Data",
    description: "Adequacy and relevance of training data.",
    rating: null
  }
];