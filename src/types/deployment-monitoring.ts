import { RatingLevel } from "./ratings";

export interface DeploymentMonitoringAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
}

export const deploymentMonitoringAspects: DeploymentMonitoringAspect[] = [
  {
    name: "MLOps Processes",
    description: "Established MLOps processes for model deployment and monitoring.",
    rating: null
  },
  {
    name: "Deployment Automation",
    description: "Automated processes for deploying models to production.",
    rating: null
  },
  {
    name: "Performance Monitoring",
    description: "Continuous monitoring of model performance in production.",
    rating: null
  },
  {
    name: "Feedback Loops",
    description: "Feedback loops for continuous model improvement.",
    rating: null
  },
  {
    name: "Model Updating",
    description: "Processes for updating models with new data or parameters.",
    rating: null
  },
  {
    name: "Model Explainability",
    description: "Explainability of AI models to stakeholders.",
    rating: null
  },
  {
    name: "Deployment Documentation",
    description: "Documentation covering model deployment and operational procedures.",
    rating: null
  }
];