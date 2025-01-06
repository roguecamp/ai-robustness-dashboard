import { AspectCard } from "./AspectCard";
import type { BusinessAlignmentAspect } from "@/types/business-alignment";

interface BusinessAlignmentGridProps {
  aspects: BusinessAlignmentAspect[];
  onAspectClick: (index: number) => void;
}

export const BusinessAlignmentGrid = ({ aspects, onAspectClick }: BusinessAlignmentGridProps) => {
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