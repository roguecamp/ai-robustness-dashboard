import { AspectCard } from "@/components/business-alignment/AspectCard";
import type { TrainingAspect } from "@/types/training";

interface TrainingGridProps {
  aspects: TrainingAspect[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
  onOwnersChange: (index: number, owners: string) => void;
}

export const TrainingGrid = ({ aspects, onAspectClick, onFindingsChange, onOwnersChange }: TrainingGridProps) => {
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