import { RatingLevel } from "./ratings";

export interface DeploymentMonitoringAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
  owners: string;
}

export const deploymentMonitoringAspects: DeploymentMonitoringAspect[] = [
  {
    name: "MLOps Processes",
    description: "Established MLOps processes for model deployment and monitoring.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Deployment Automation",
    description: "Automated processes for deploying models to production.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Performance Monitoring",
    description: "Continuous monitoring of model performance in production.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Feedback Loops",
    description: "Feedback loops for continuous model improvement.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Model Updating",
    description: "Processes for updating models with new data or parameters.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Model Explainability",
    description: "Explainability of AI models to stakeholders.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Deployment Documentation",
    description: "Documentation covering model deployment and operational procedures.",
    rating: null,
    findings: "",
    owners: ""
  }
];
