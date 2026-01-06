import type { BaseAspect } from "@/types/ratings";

export interface AspectConfig {
  pillarTitle: string;
  practicePrefix: string;
  initialAspects: BaseAspect[];
}

// Helper to create default aspect
const createAspect = (name: string, description: string): BaseAspect => ({
  name,
  description,
  rating: null,
  findings: "",
  owners: ""
});

export const aspectConfigs: Record<string, AspectConfig> = {
  // People Pillar
  "training": {
    pillarTitle: "People",
    practicePrefix: "Training:",
    initialAspects: [
      createAspect("AI Literacy Programs", "Training programs to enhance overall AI literacy."),
      createAspect("Technical Training", "Courses for developing AI technical skills."),
      createAspect("Continuous Learning", "Opportunities for ongoing AI learning and development."),
      createAspect("Certification Programs", "AI certifications and professional development."),
      createAspect("Leadership Training", "AI training for management and executives."),
      createAspect("Knowledge Assessment", "Methods to assess and validate AI knowledge."),
      createAspect("Training Resources", "Availability of AI learning materials and resources.")
    ]
  },
  "collaboration": {
    pillarTitle: "People",
    practicePrefix: "Collaboration:",
    initialAspects: [
      createAspect("Interdisciplinary Teams", "Existance and effectiveness of cross-functional teams."),
      createAspect("External Partnerships", "Relationships with external AI consultants, vendors, and academic institutions."),
      createAspect("Collaboration Tools", "Availability and utilization of collaboration tools"),
      createAspect("Knowledge Sharing", "Platforms and practices for sharing AI knowledge across the organization"),
      createAspect("Project Management", "Effectiuveness in managing AI projects across different teams."),
      createAspect("Innovation Culture", "Encouragement and support for innovative ideas and experimentation."),
      createAspect("Feedback Loops", "Mechanisms for collecting and acting on feedback from various stakeholders.")
    ]
  },
  "changeManagement": {
    pillarTitle: "People",
    practicePrefix: "ChangeManagement:",
    initialAspects: [
      createAspect("Change Leadership", "Leadership commitment to AI-driven change."),
      createAspect("Communication Strategy", "Clear communication about AI initiatives and impacts."),
      createAspect("Stakeholder Engagement", "Involvement of stakeholders in change processes."),
      createAspect("Resistance Management", "Strategies to address and overcome resistance."),
      createAspect("Training for Change", "Training to help employees adapt to new AI tools."),
      createAspect("Change Metrics", "Metrics to measure change adoption success."),
      createAspect("Continuous Improvement", "Feedback loops for continuous change improvement.")
    ]
  },

  // Strategy Pillar
  "businessAlignment": {
    pillarTitle: "Strategy",
    practicePrefix: "Business:",
    initialAspects: [
      createAspect("AI Strategy Alignment", "Alignment of AI initiatives with business goals."),
      createAspect("ROI Measurement", "Methods to measure AI return on investment."),
      createAspect("Business Case Development", "Process for developing AI business cases."),
      createAspect("Executive Sponsorship", "Senior leadership support for AI initiatives."),
      createAspect("Resource Allocation", "Allocation of resources for AI projects."),
      createAspect("Priority Setting", "Clear prioritization of AI initiatives."),
      createAspect("Value Realization", "Tracking and realizing AI business value.")
    ]
  },
  "scalability": {
    pillarTitle: "Strategy",
    practicePrefix: "Scalability:",
    initialAspects: [
      createAspect("Scalability Planning", "Planning for scaling AI solutions across the organization."),
      createAspect("Resource Allocation", "Allocation of resources for scaling AI initiatives."),
      createAspect("Adoption Metrics", "Metrics to measure AI adoption success."),
      createAspect("Change Readiness", "Assessment of organizational readiness for AI adoption."),
      createAspect("Pilot Programs", "Structured approach to AI pilot programs."),
      createAspect("Enterprise Integration", "Integration of AI solutions with existing enterprise systems."),
      createAspect("User Acceptance", "User acceptance and satisfaction with AI solutions.")
    ]
  },
  "innovation": {
    pillarTitle: "Strategy",
    practicePrefix: "Innovation:",
    initialAspects: [
      createAspect("Innovation Framework", "Established framework for AI innovation."),
      createAspect("Research and Development", "Investment in AI research and development."),
      createAspect("Experimentation Culture", "Culture that encourages AI experimentation."),
      createAspect("Idea Management", "Process for collecting and evaluating AI ideas."),
      createAspect("Proof of Concept", "Structured approach to AI proof of concepts."),
      createAspect("Technology Scouting", "Monitoring emerging AI technologies."),
      createAspect("Innovation Metrics", "Metrics to measure AI innovation success.")
    ]
  },

  // Data Pillar
  "dataAcquisition": {
    pillarTitle: "Data",
    practicePrefix: "Data Acquisition:",
    initialAspects: [
      createAspect("Data Sources", "Identification and access to diverse data sources."),
      createAspect("Data Collection", "Processes for systematic data collection."),
      createAspect("Data Quality", "Ensuring data accuracy and reliability."),
      createAspect("Data Integration", "Integration of data from multiple sources."),
      createAspect("Data Validation", "Validation processes for collected data."),
      createAspect("Data Documentation", "Documentation of data sources and collection methods."),
      createAspect("Real-time Data", "Capability to collect and process real-time data.")
    ]
  },
  "dataGovernance": {
    pillarTitle: "Data",
    practicePrefix: "DataGovernance:",
    initialAspects: [
      createAspect("Data Governance Framework", "Established data governance framework with clear policies and procedures."),
      createAspect("Data Stewardship", "Defined data ownership and stewardship roles."),
      createAspect("Data Quality", "Processes to ensure and enhance data quality."),
      createAspect("Data Access Controls", "Role-based access controls to restrict data access."),
      createAspect("Data Lifecycle Management", "Managing data throughout its lifecycle from collection to deletion."),
      createAspect("Data Security", "Security measures to protect data from unauthorized access."),
      createAspect("Data Privacy", "Ensuring data privacy compliance and protection.")
    ]
  },
  "dataPrivacy": {
    pillarTitle: "Data",
    practicePrefix: "DataPrivacy:",
    initialAspects: [
      createAspect("Privacy Policies", "Clear data privacy policies and procedures."),
      createAspect("Data Encryption", "Encryption of sensitive data at rest and in transit."),
      createAspect("Consent Management", "Mechanisms for obtaining and managing data consent."),
      createAspect("Data Anonymization", "Techniques for anonymizing personal data."),
      createAspect("Privacy by Design", "Integration of privacy considerations in AI development."),
      createAspect("Data Subject Rights", "Processes to handle data subject requests."),
      createAspect("Privacy Impact Assessment", "Regular privacy impact assessments for AI systems.")
    ]
  },

  // Legal Pillar
  "intellectualProperty": {
    pillarTitle: "Legal",
    practicePrefix: "IntellectualProperty:",
    initialAspects: [
      createAspect("IP Strategy", "Defined intellectual property strategy for AI."),
      createAspect("Patent Management", "Processes for managing AI patents."),
      createAspect("Trade Secrets", "Protection of AI-related trade secrets."),
      createAspect("Licensing Agreements", "Management of AI software licensing."),
      createAspect("Open Source Compliance", "Compliance with open source licensing terms."),
      createAspect("IP Ownership", "Clear ownership of AI-generated intellectual property."),
      createAspect("IP Training", "Training on intellectual property considerations.")
    ]
  },
  "ethicalConsiderations": {
    pillarTitle: "Legal",
    practicePrefix: "EthicalConsiderations:",
    initialAspects: [
      createAspect("Ethics Framework", "Established AI ethics framework and guidelines."),
      createAspect("Bias Detection", "Processes for detecting and mitigating AI bias."),
      createAspect("Fairness Assessment", "Regular assessment of AI system fairness."),
      createAspect("Transparency", "Transparency in AI decision-making processes."),
      createAspect("Accountability", "Clear accountability for AI system outcomes."),
      createAspect("Ethics Review Board", "Existence of AI ethics review processes."),
      createAspect("Human Oversight", "Human oversight of AI decisions.")
    ]
  },
  "complianceRegulation": {
    pillarTitle: "Legal",
    practicePrefix: "ComplianceRegulation:",
    initialAspects: [
      createAspect("Regulatory Awareness", "Awareness of AI-related regulations and standards."),
      createAspect("Compliance Framework", "Framework for ensuring AI regulatory compliance."),
      createAspect("Audit Readiness", "Readiness for AI compliance audits."),
      createAspect("Documentation", "Documentation of AI compliance activities."),
      createAspect("Risk Assessment", "Regular compliance risk assessments."),
      createAspect("Reporting Mechanisms", "Mechanisms for compliance reporting."),
      createAspect("Remediation Processes", "Processes for addressing compliance issues.")
    ]
  },

  // Solution Pillar
  "infrastructure": {
    pillarTitle: "Solution",
    practicePrefix: "Infrastructure:",
    initialAspects: [
      createAspect("Compute Resources", "Availability of computational resources for AI."),
      createAspect("Cloud Infrastructure", "Cloud infrastructure for AI workloads."),
      createAspect("Data Storage", "Scalable data storage solutions."),
      createAspect("Network Capacity", "Network capacity for AI data transfer."),
      createAspect("Development Environment", "AI development tools and environments."),
      createAspect("Hardware Acceleration", "GPU/TPU availability for AI training."),
      createAspect("Infrastructure Security", "Security of AI infrastructure.")
    ]
  },
  "modelDevelopment": {
    pillarTitle: "Solution",
    practicePrefix: "ModelDevelopment:",
    initialAspects: [
      createAspect("Development Methodology", "Structured AI model development methodology."),
      createAspect("Model Training", "Processes for training AI models."),
      createAspect("Model Validation", "Validation of AI model performance."),
      createAspect("Version Control", "Version control for AI models and code."),
      createAspect("Feature Engineering", "Feature engineering practices."),
      createAspect("Hyperparameter Tuning", "Systematic hyperparameter optimization."),
      createAspect("Model Documentation", "Documentation of AI models and experiments.")
    ]
  },
  "deploymentMonitoring": {
    pillarTitle: "Solution",
    practicePrefix: "DeploymentMonitoring:",
    initialAspects: [
      createAspect("Deployment Pipeline", "Automated AI model deployment pipeline."),
      createAspect("A/B Testing", "A/B testing for AI model deployment."),
      createAspect("Performance Monitoring", "Monitoring of AI model performance."),
      createAspect("Model Drift Detection", "Detection of model drift over time."),
      createAspect("Incident Response", "Incident response for AI system failures."),
      createAspect("Rollback Capability", "Capability to rollback AI deployments."),
      createAspect("SLA Management", "Service level agreement management for AI systems.")
    ]
  }
};

export const getAspectConfig = (key: string): AspectConfig | undefined => {
  return aspectConfigs[key];
};
