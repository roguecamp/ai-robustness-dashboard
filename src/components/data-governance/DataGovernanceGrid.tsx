import { AspectCard } from "./AspectCard";
import type { DataGovernanceAspect } from "@/types/data-governance";

interface DataGovernanceGridProps {
  aspects: DataGovernanceAspect[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
  onOwnersChange: (index: number, owners: string) => void;
}

export const DataGovernanceGrid = ({ aspects, onAspectClick, onFindingsChange, onOwnersChange }: DataGovernanceGridProps) => {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
          onFindingsChange={(findings) => onFindingsChange(index, findings)}
          onOwnersChange={(owners) => onOwnersChange(index, owners)}
        />
      ))}
    </div>
  );
};