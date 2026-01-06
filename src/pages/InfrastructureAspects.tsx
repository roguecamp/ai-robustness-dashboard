import { AspectPageLayout } from "@/components/shared/AspectPageLayout";

export default function InfrastructureAspects() {
  return (
    <AspectPageLayout
      configKey="infrastructure"
      title="Infrastructure Aspects"
      description="Rate each aspect of Infrastructure by clicking on the cards. Click multiple times to cycle through ratings."
      mainPracticeName="Infrastructure"
    />
  );
}
