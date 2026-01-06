import { AspectPageLayout } from "@/components/shared/AspectPageLayout";

export default function DeploymentMonitoringAspects() {
  return (
    <AspectPageLayout
      configKey="deploymentMonitoring"
      title="Deployment and Monitoring Aspects"
      description="Rate each aspect of Deployment and Monitoring by clicking on the cards. Click multiple times to cycle through ratings."
      mainPracticeName="Deployment and Monitoring"
    />
  );
}
