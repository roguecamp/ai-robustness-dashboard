import { AspectCard } from "./AspectCard";
import type { DeploymentMonitoringAspect } from "@/types/deployment-monitoring";

interface DeploymentMonitoringGridProps {
  aspects: DeploymentMonitoringAspect[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
}

export const DeploymentMonitoringGrid = ({ 
  aspects, 
  onAspectClick, 
  onFindingsChange 
}: DeploymentMonitoringGridProps) => {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
          onFindingsChange={(findings) => onFindingsChange(index, findings)}
        />
      ))}
    </div>
  );
};