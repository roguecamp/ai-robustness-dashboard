import { AspectCard } from "./AspectCard";
import type { DataGovernanceAspect } from "@/types/data-governance";

interface DataGovernanceGridProps {
  aspects: DataGovernanceAspect[];
  onAspectClick: (index: number) => void;
}

export const DataGovernanceGrid = ({ aspects, onAspectClick }: DataGovernanceGridProps) => {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
        />
      ))}
    </div>
  );
};