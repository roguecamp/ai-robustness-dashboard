import { RatingLevel } from "./ratings";

export interface DeploymentMonitoringAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
}

export const deploymentMonitoringAspects: DeploymentMonitoringAspect[] = [
  {
    name: "MLOps Processes",
    description: "Established MLOps processes for model deployment and monitoring.",
    rating: null,
    findings: ""
  },
  {
    name: "Deployment Automation",
    description: "Automated processes for deploying models to production.",
    rating: null,
    findings: ""
  },
  {
    name: "Performance Monitoring",
    description: "Continuous monitoring of model performance in production.",
    rating: null,
    findings: ""
  },
  {
    name: "Feedback Loops",
    description: "Feedback loops for continuous model improvement.",
    rating: null,
    findings: ""
  },
  {
    name: "Model Updating",
    description: "Processes for updating models with new data or parameters.",
    rating: null,
    findings: ""
  },
  {
    name: "Model Explainability",
    description: "Explainability of AI models to stakeholders.",
    rating: null,
    findings: ""
  },
  {
    name: "Deployment Documentation",
    description: "Documentation covering model deployment and operational procedures.",
    rating: null,
    findings: ""
  }
];