import { ModelDevelopmentCard } from "./ModelDevelopmentCard";
import type { ModelDevelopmentAspect } from "@/types/model-development";

interface ModelDevelopmentGridProps {
  aspects: ModelDevelopmentAspect[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
}

export const ModelDevelopmentGrid = ({ aspects, onAspectClick, onFindingsChange }: ModelDevelopmentGridProps) => {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <ModelDevelopmentCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
          onFindingsChange={(findings) => onFindingsChange(index, findings)}
        />
      ))}
    </div>
  );
};