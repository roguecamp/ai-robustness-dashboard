import { AspectCard } from "@/components/shared/AspectCard";
import type { TrainingAspect } from "@/types/training";

interface TrainingGridProps {
  aspects: TrainingAspect[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
}

export const TrainingGrid = ({ aspects, onAspectClick, onFindingsChange }: TrainingGridProps) => {
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